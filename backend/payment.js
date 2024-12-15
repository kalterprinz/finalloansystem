const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    loanId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Loan', 
        required: true,
    },
    amountDue: { type: Number, required: true }, // `true` must be a property of `required`
    paymentDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: ['upcoming', 'paid', 'overdue'],required: true },
    
});

const PaymentModel = mongoose.model('Payment', PaymentSchema);

module.exports = PaymentModel;
