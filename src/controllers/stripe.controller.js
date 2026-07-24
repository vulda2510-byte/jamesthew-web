// src/controllers/stripe.controller.js

const createCheckoutSession = async (req, res, next) => {
    try {
        const { plan } = req.body; // 'premium' hoặc 'vip'
        
        // TODO: Chỗ này sau này bạn sẽ dùng thư viện 'stripe' của Node.js để tạo session thanh toán thật.
        // Tạm thời chúng ta trả về một URL giả lập để luồng Frontend hoạt động mượt mà.
        
        const mockStripeUrl = `/membership/success?plan=${plan}`; 

        res.status(200).json({
            success: true,
            checkoutUrl: mockStripeUrl // Frontend sẽ redirect người dùng sang link này
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCheckoutSession };