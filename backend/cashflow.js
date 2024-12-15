const mongoose = require('mongoose');

const cashflowSchema = new mongoose.Schema({
    loanId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Loan', // Refers to the Loan model
        required: true, // Ensure that every cashflow is associated with a loan
    },
    totalIncome: { type: Number, required: true }, // `true` must be a property of `required`
    totalExpenditures: { type: Number, required: true },
    totalCashOutlays: { type: Number, required: true },
    totalExpenditureAndCashOutlays: { type: Number, required: true },
    netSavings: { type: Number, required: true },
    otherOutlays: { type: String},
    otherOutlays: { type: String},
    comaker: { type: String, default: '' },
    cfaplidate: { type: Date }, // Not required, optional field
    memberBorSig: {
        data: { type: Buffer, required: true }, // The buffer is required
        contentType: { type: String, required: true }, // The contentType is required
    },
});

const Cashflow = mongoose.model('Cashflow', cashflowSchema);

module.exports = Cashflow;
