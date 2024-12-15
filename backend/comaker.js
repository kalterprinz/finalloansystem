const mongoose = require('mongoose');

const ComakerSchema = new mongoose.Schema({
    loanId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Loan', // Refers to the Loan model
        required: true, // Ensure that every cashflow is associated with a loan
    },
    branch:
    {
        type: String,
        enum: ['Tibanga-Main', 'Pala-o', 'Buru-un', 'Kiwalan', 'Poblacion', 'Suarez-Tominobo', 'Tubod Iligan'],
        required: true
    },
    applicationDate: {
        type: Date,
        required: true
    },
    comakerName:{
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
    residentStatus:{
        type:String,
        enum:['owned','free of use','renting'],
        required: true
    },
    amortization:{
        type:Number,
        required: true
    },
    employer:{
        type:String,
    },
    businessAdd:{
        type:String,
    },
    empStatus:{
        type:String,
    },
    lengthService:{
        type:Number,
    },
    annualSalary:{
        type:Number,
    },
    firm:{
        type:String,
    },
    businessAdd2:{
        type:String,
    },
    natureBus:{
        type:String,
    },
    soleOwner:{
        type:String,
    },
    capitalInvest:{
        type:Number,
    },
    creditor1:{
        type:String,
    },
    creditor2:{
        type:String,
    },
    creditor3:{
        type:String,
    },
    principalAmount1:{
        type:String,
    },
    principalAmount2:{
        type:String,
    },
    principalAmount3:{
        type:String,
    },
    presentBalance1:{
        type:String,
    },
    presentBalance2:{
        type:String,
    },
    presentBalance3:{
        type:String,
    },
    maturityDate1:{
        type:String,
    },
    maturityDate2:{
        type:String,
    },
    maturityDate3:{
        type:String,
    },
    description1: {
        type: String,
    },
    location1: {
        type: String,
    },
    area1: {
        type: String,
    },
    marketValue1: {
        type: String,
    },
    encumbrances1: {
        type: String,
    },
    description2: {
        type: String,
    },
    location2: {
        type: String,
    },
    area2: {
        type: String,
    },
    marketValue2: {
        type: String,
    },
    encumbrances2: {
        type: String,
    },
    description3: {
        type: String,
    },
    location3: {
        type: String,
    },
    area3: {
        type: String,
    },
    marketValue3: {
        type: String,
    },
    encumbrances3: {
        type: String,
    },
    relationship:{
        type:String,
        required: true
    },
    yearsKnown:{
        type:Number,
        required: true
    },
    memberSig: {
        data: { type: Buffer, required: true }, // The buffer is required
        contentType: { type: String, required: true }, // The contentType is required
    },

})

const ComakerModel = mongoose.model('Comaker', ComakerSchema);

module.exports = ComakerModel;