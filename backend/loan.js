const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true, // Ensure that every cashflow is associated with a loan
        },
    newRe: {
        type: String,
        enum: ['new', 'renewal'],
        required: true
    },
    branch: {
        type: String,
        enum: ['Tibanga-Main', 'Pala-o', 'Buru-un', 'Kiwalan', 'Poblacion', 'Suarez-Tominobo', 'Tubod Iligan'],
        required: true
    },
    applicationDate: {
        type: Date,
        required: true
    },
    applicantName:{
        type:String,
        required: true
    },
    emailAddress:{
        type:String,
        required: true
    },
    permanentAddress:{
        type:String,
        required: true
    },
    presentAddress:{
        type:String,
        required: true
    },
    telMob:{
        type:String,
        required: true
    },
    age:{
        type:Number,
        required: true
    },
    sex:{
        type:String,
        enum: ['female','male'],
        required: true
    },
    civilStatus:{
        type:String,
        enum: ['single','married','widowed'],
        required: true
    },
    spouseName:{
        type:String,
    },
    spouseOccu:{
        type:String,
    },
    location:{
        type:String,
        required: true
    },
    loanType:{
        type:String,
        enum:['personal','educational','pensioner'],
        required: true
    },
    loanAmount:{
        type:Number,
        required: true
    },
    loanTerm:{
        type:Number,
        required: true
    },
    purposeLoan:{
        type:String,
        required: true
    },
    employer:{
        type:String,
    },
    empCon:{
        type:String,
    },
    empStatus:{
        type:String,
    },
    businessName:{
        type:String,
    },
    businessAdd:{
        type:String,
    },
    lengthMem:{
        type:Number,
        required: true
    },
    shareCapital:{
        type:Number,
        required: true
    },
    savingsDepo:{
        type:Number,
        required: true
    },
    otherDepo:{
        type:Number,
    },
    collateral:{
        type:String,
        required: true
    },
    sourcePay:{
        type:String,
        required: true
    },
    modePay:{
        type:String,
        enum:['daily','weekly','monthly','quarterly'],
        required: true
    },
    mannerPay:{
        type:String,
        enum:['otc','collector','payroll','pdc','auto-debit'],
        required: true
    },
    memberSig: {
        data: { type: Buffer, required: true }, // The buffer is required
        contentType: { type: String, required: true }, // The contentType is required
    },
    spouseSig: {
        data: { type: Buffer }, // Optional buffer
        contentType: { type: String }, // Optional contentType
    },
    interestRate:{
        type:Number,
        required: true
    },
    disbursementDate:{
        type:Date,
        required: true
    },
    paymentStatus:{
        type:String,
        enum:['overdue','paid','upcoming'],
        required: true
    },
    defaultStatus:{
        type:String,
        enum:['pending','review','approved','rejected'],
        required: true
    },
    riskRating:{
        type:String,
        enum:['low','medium','high'],
        required: true
    },
    verifiedby:{
        type:String,
    },
    approvalDate:{
        type:Date,
        required: true
    },
    notes:{
        type:String,
        required: true
    },
});

const LoanModel = mongoose.model('Loan', LoanSchema);

module.exports = LoanModel;
