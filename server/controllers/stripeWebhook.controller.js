// import stripe from "../config/stripe.js"
// import User from "../models/user.model.js"

// export const stripeWebhook=async (req,res) =>{
//     const sig=req.headers["stripe-signature"]
//     let event;
//     try {
//         event=stripe.webhooks.constructEvent(
//             req.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         )
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message: "webhook error"})
//     }

//     if(event.type=="checkout.session.completed"){
//         const session=event.data.object
//         const userId=session.metadata.userId
//         const credits=Number(session.metadata.credits)
//         const plan=session.metadata.plan

//       await User.findByIdAndUpdate(userId, {
//     $inc: { credits: credits },
//     $set: { plan: plan }
// })
//     }
//     return res.json({received: true})
// }
import stripe from "../config/stripe.js"
import User from "../models/user.model.js"

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
        console.log("✅ Webhook verified, event type:", event.type)
    } catch (error) {
        console.log("❌ Signature failed:", error.message)
        return res.status(400).json({ message: "webhook error" })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object
        console.log("📦 Metadata:", session.metadata)
        console.log("💳 Payment status:", session.payment_status)

        if (session.payment_status !== "paid") {
            console.log("⚠️ Payment not paid, skipping")
            return res.json({ received: true })
        }

        const userId = session.metadata.userId
        const credits = Number(session.metadata.credits)
        const plan = session.metadata.plan

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $inc: { credits: credits }, $set: { plan: plan } },
                { new: true }
            )
            console.log("✅ User updated:", updatedUser?.credits, "credits, plan:", updatedUser?.plan)
        } catch (dbError) {
            console.log("❌ DB error:", dbError.message)
            return res.status(500).json({ message: "db error" })
        }
    }

    return res.json({ received: true })
}