const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const UserModel = require('./user');
const LoanModel = require('./loan');
const Cashflow = require('./cashflow');
const ComakerModel = require('./comaker');
const PaymentModel = require('./payment');
const jwt = require('jsonwebtoken');
var cors = require ('cors')

const app = express();
const port = 3001;
app.use(cors())

app.use(express.json())
app.use(bodyParser.json());

mongoose.connect('mongodb://192.168.1.82:27017/loan')
    .then(() => console.log('DB is connected'))
    .catch(err => console.error('Connection error:', err));

app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        // Find user by username or email
        const user = await UserModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            'your_secret_key', // Replace with your secret key
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token, userId: user._id, role: user.role });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});

app.post('/signup', async (req, res) => {
    const { username, email, role, password } = req.body;
  
    try {

        if (!['admin', 'member'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be either "admin" or "member".' });
        }
        
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new UserModel({
        username,
        email,
        role,
        password: hashedPassword,
      });
  
      const user = await newUser.save();
      res.status(201).json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Failed to create user' });
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST endpoint for creating loans with embedded images
app.post('/loan', upload.fields([{ name: 'memberSig' }, { name: 'spouseSig' }]), async (req, res) => {
    const { 
        userId, branch, applicationDate, newRe, applicantName, emailAddress,
        permanentAddress, presentAddress, telMob, age, sex, civilStatus, 
        spouseName, spouseOccu, location, loanType, loanAmount, loanTerm, 
        purposeLoan, employer, empCon, empStatus, businessName, businessAdd, 
        lengthMem, shareCapital, savingsDepo, otherDepo ,collateral, sourcePay,
        modePay, mannerPay, interestRate, disbursementDate, paymentStatus,
        defaultStatus, riskRating, verifiedby, approvalDate, notes,
    } = req.body;

    try {
        const { files } = req;

        // Validate required fields
        if (!branch || !applicationDate || !newRe || !applicantName) {
            return res.status(400).json({ error: 'Branch, application date, application type, and applicant name are required.' });
        }

        // Prepare image data if provided
        const memberSig = files.memberSig ? files.memberSig[0] : null;
        const spouseSig = files.spouseSig ? files.spouseSig[0] : null;

        // Create a new Loan object
        const newLoan = new LoanModel({
            userId,
            branch,
            applicationDate,
            newRe,
            applicantName,
            emailAddress,
            permanentAddress,
            presentAddress,
            telMob,
            age,
            sex,
            civilStatus,
            spouseName,
            spouseOccu,
            location,
            loanType,
            loanAmount,
            loanTerm,
            purposeLoan,
            employer,
            empCon,
            empStatus,
            businessName,
            businessAdd,
            lengthMem,
            shareCapital,
            savingsDepo,
            otherDepo,
            collateral,
            sourcePay,
            modePay,
            mannerPay,
            interestRate,
            disbursementDate,
            paymentStatus,
            defaultStatus,
            riskRating,
            verifiedby,
            approvalDate,
            notes,
            memberSig: memberSig
                ? {
                      data: memberSig.buffer,
                      contentType: memberSig.mimetype,
                  }
                : undefined,
            spouseSig: spouseSig
                ? {
                      data: spouseSig.buffer,
                      contentType: spouseSig.mimetype,
                  }
                : undefined,
        });

        // Save the newLoan object to the database
        await newLoan.save();
        return res.status(201).json({ 
            _id: newLoan._id 
        });

    } catch (error) {
        console.error('Error submitting loan:', error);
        return res.status(500).json({ 
            error: 'An error occurred while processing your request.',
            details: error.message // Include error message details for debugging
        });
    }
});

app.post('/cashflow', upload.fields([{ name: 'memberBorSig' }]), async (req, res) => {
    const {
        loanId,
        totalIncome,
        totalExpenditures,
        totalCashOutlays,
        totalExpenditureAndCashOutlays,
        netSavings,
        otherDebts,
        otherOutlays,
        comaker,
        cfaplidate,
    } = req.body;
    
    try {
        const { files } = req;
        
        if (!loanId) {
            return res.status(400).json({ error: 'loanId is required to associate the cashflow with a loan.' });
        }

        // Validate required fields
        if (!totalIncome || !totalExpenditures || !totalCashOutlays || !totalExpenditureAndCashOutlays || !netSavings) {
            return res.status(400).json({ error: 'Required fields are missing.' });
        }

        const memberBorSig = files.memberBorSig ? files.memberBorSig[0] : null;

        const loanExists = await LoanModel.findById(loanId);
        if (!loanExists) {
            return res.status(404).json({ error: 'Loan with the provided ID does not exist.' });
        }


        // Prepare the cashflow object
        const newCashflow = new Cashflow({
            loanId,
            totalIncome: Number(totalIncome),
            totalExpenditures: Number(totalExpenditures),
            totalCashOutlays: Number(totalCashOutlays),
            totalExpenditureAndCashOutlays: Number(totalExpenditureAndCashOutlays),
            netSavings: Number(netSavings),
            otherDebts,
            otherOutlays,
            comaker,
            cfaplidate: cfaplidate ? new Date(cfaplidate) : undefined,
            memberBorSig: memberBorSig
                ? {
                      data: memberBorSig.buffer,
                      contentType: memberBorSig.mimetype,
                  }
                : undefined,
        });

        await newCashflow.save();

        return res.status(201).json({
            cashflow: newCashflow,
        });
    
    } catch (error) {
        console.error('Error submitting loan:', error);
        return res.status(500).json({ 
            error: 'An error occurred while processing your request.',
            details: error.message // Include error message details for debugging
        });
    }
});

app.post('/comaker', upload.fields([{ name: 'memberSig' }]), async (req, res) => {
    const {
        loanId,
        branch,
        applicationDate,
        comakerName,
        emailAddress,
        permanentAddress,
        presentAddress,
        telMob,
        age,
        sex,
        civilStatus,
        spouseName,
        residentStatus,
        amortization,
        employer,
        businessAdd,
        empStatus,
        lengthService,
        annualSalary,
        firm,
        businessAdd2,
        natureBus,
        soleOwner,
        capitalInvest,
        creditor1,
        principalAmount1,
        presentBalance1,
        maturityDate1,
        creditor2,
        principalAmount2,
        presentBalance2,
        maturityDate2,
        creditor3,
        principalAmount3,
        presentBalance3,
        maturityDate3,
        description1,
        location1,
        area1,
        encumbrances1,
        marketValue1,
        description2,
        location2,
        area2,
        encumbrances2,
        marketValue2,
        description3,
        location3,
        area3,
        encumbrances3,
        marketValue3,
        relationship,
        yearsKnown,
    } = req.body;
    
    try {
        const { files } = req;

        const memberSig = files.memberSig ? files.memberSig[0] : null;

        const newComaker = new ComakerModel({
            loanId,
            branch,
            applicationDate,
            comakerName,
            emailAddress,
            permanentAddress,
            presentAddress,
            telMob,
            age,
            sex,
            civilStatus,
            spouseName,
            residentStatus,
            amortization,
            employer,
            businessAdd,
            empStatus,
            lengthService,
            annualSalary,
            firm,
            businessAdd2,
            natureBus,
            soleOwner,
            capitalInvest,
            creditor1,
            principalAmount1,
            presentBalance1,
            maturityDate1,
            creditor2,
            principalAmount2,
            presentBalance2,
            maturityDate2,
            creditor3,
            principalAmount3,
            presentBalance3,
            maturityDate3,
            description1,
            location1,
            area1,
            encumbrances1,
            marketValue1,
            description2,
            location2,
            area2,
            encumbrances2,
            marketValue2,
            description3,
            location3,
            area3,
            encumbrances3,
            marketValue3,
            relationship,
            yearsKnown,
            memberSig: memberSig
                ? {
                      data: memberSig.buffer,
                      contentType: memberSig.mimetype,
                  }
                : undefined,
        });

        await newComaker.save();

        return res.status(201).json({
            comaker: newComaker,
        });
    
    } catch (error) {
        console.error('Error submitting loan:', error);
        return res.status(500).json({ 
            error: 'An error occurred while processing your request.',
            details: error.message // Include error message details for debugging
        });
    }
});

app.get('/pics/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params; // Get image ID from the route parameter
        const { imageType } = req.query; // Get image type from the query parameter

        // Fetch the document from MongoDB using the imageId
        const document = await ImageModel.findById(imageId);

        if (!document) {
            return res.status(404).send('Image not found');
        }

        // Determine which image to send
        let image;
        if (imageType === 'spouseSig') {
            image = document.spouseSig;
        } else {
            image = document.memberSig; // Default to memberSig
        }

        // Check if the selected image exists
        if (!image || !image.data) {
            return res.status(404).send('Selected image not found');
        }

        // Set response content type and send the image data
        res.contentType(image.contentType);
        res.send(image.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal server error');
    }
});


app.put('/loan/:id', async (req, res) => {
    const loanId = req.params.id; // Using the ObjectID from the URL
    const updateData = req.body;

    try {
        const loan = await LoanModel.findByIdAndUpdate(
            loanId,           // Query using _id directly
            updateData,       // The data to update
            { new: true }     // Return the updated document
        );

        if (!loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        res.status(200).json(loan);
    } catch (err) {
        console.error('Error updating loan:', err);
        res.status(500).json({ error: 'Failed to update loan' });
    }
});


app.get('/loans', async (req, res) => {
    try {
        const { defaultStatus } = req.query;

        // If a defaultStatus is specified, use it as a filter; otherwise, return all loans
        const filter = defaultStatus ? { defaultStatus } : {};
        const loans = await LoanModel.find(filter);

        res.status(200).json(loans);
    } catch (err) {
        console.error('Error fetching loans:', err);
        res.status(500).json({ message: 'Failed to retrieve loans' });
    }
});

app.get('/loans/pending', async (req, res) => {
    try {
        const pendingLoans = await LoanModel.find({ defaultStatus: 'pending' });
        res.status(200).json(pendingLoans);
    } catch (err) {
        console.error('Error fetching pending loans:', err);
        res.status(500).json({ message: 'Failed to retrieve pending loans' });
    }
});

app.get('/borrowers/approved', async (req, res) => {
    try {
        const approvedBorrowers = await LoanModel.find({ defaultStatus: 'approved' });
        res.status(200).json(approvedBorrowers);
    } catch (err) {
        console.error('Error fetching approved borrowers:', err);
        res.status(500).json({ message: 'Failed to retrieve approved borrowers' });
    }
});

app.get('/loan/approved/count', async (req, res) => {
    try {
        console.log("Counting approved loans...");
        const count = await LoanModel.countDocuments({ defaultStatus: 'approved' });
        console.log("Approved loans count:", count);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error in /loan/approved/count:", error.message, error.stack);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.get('/loan/pending/count', async (req, res) => {
    try {
        console.log("Counting pending loans...");
        const count = await LoanModel.countDocuments({ defaultStatus: 'pending' });
        console.log("Pending loans count:", count);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error in /loan/pending/count:", error.message, error.stack);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.get('/loan/review/count', async (req, res) => {
    try {
        console.log("Counting overdue loans...");
        const count = await LoanModel.countDocuments({ defaultStatus: 'review' });
        console.log("Review loans count:", count);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error in /loan/review/count:", error.message, error.stack);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.get('/loan/rejected/count', async (req, res) => {
    try {
        console.log("Counting rejected loans...");
        const count = await LoanModel.countDocuments({ defaultStatus: 'rejected' });
        console.log("Rejected loans count:", count);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error in /loan/rejected/count:", error.message, error.stack);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.get('/loans/payment/graph', async (req, res) => {
    try {
      // Fetch all loans from the database
      const loans = await LoanModel.find();
  
      // Debugging: Log fetched loans
      console.log('Fetched loans:', loans);
  
      if (!loans || loans.length === 0) {
        return res.status(404).json({ message: 'No loans found' });
      }
  
      // Count the loans based on their payment status
      const paidCount = loans.filter(loan => loan.paymentStatus === 'paid').length;
      const overdueCount = loans.filter(loan => loan.paymentStatus === 'overdue').length;
      const upcomingCount = loans.filter(loan => loan.paymentStatus === 'upcoming').length;
  
      res.status(200).json({
        paid: paidCount,
        overdue: overdueCount,
        upcoming: upcomingCount,
      });
    } catch (error) {
      console.error('Error fetching loan repayment status:', error.message, error.stack);
      res.status(500).json({ message: 'Error fetching loan repayment status', error: error.message });
    }
  });

  app.get('/loans/type/graph', async (req, res) => {
    try {
      // Fetch all loans from the database
      const loans = await LoanModel.find();
  
      // Debugging: Log fetched loans
      console.log('Fetched loans:', loans);
  
      if (!loans || loans.length === 0) {
        return res.status(404).json({ message: 'No loans found' });
      }
  
      // Count the loans based on their payment status
      const personalrr = loans.filter(loan => loan.loanType === 'personal').length;
      const educationalrr = loans.filter(loan => loan.loanType === 'educational').length;
      const pensionerrr = loans.filter(loan => loan.loanType === 'pensioner').length;
  
      res.status(200).json({
        personal: personalrr,
        educational: educationalrr,
        pensioner: pensionerrr,
      });
    } catch (error) {
      console.error('Error fetching loan repayment status:', error.message, error.stack);
      res.status(500).json({ message: 'Error fetching loan repayment status', error: error.message });
    }
  });

  app.get('/loans/status/count', async (req, res) => {
    try {
        // Fetch all loans from the database
        const loans = await LoanModel.find();

        // Debugging: Log fetched loans
        console.log('Fetched loans:', loans);

        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loans found' });
        }

        // Count loans based on their status
        const approvedCount = loans.filter(loan => loan.defaultStatus === 'approved').length;
        const pendingCount = loans.filter(loan => loan.defaultStatus === 'pending').length;
        const overdueCount = loans.filter(loan => loan.paymentStatus === 'overdue').length;
        const rejectedCount = loans.filter(loan => loan.defaultStatus === 'rejected').length;

        res.status(200).json({
            approved: approvedCount,
            pending: pendingCount,
            overdue: overdueCount,
            rejected: rejectedCount,
        });
    } catch (error) {
        console.error('Error fetching loan status counts:', error.message, error.stack);
        res.status(500).json({
            message: 'Error fetching loan status counts',
            error: error.message,
        });
    }
});


// API endpoint for dynamic age distribution
app.get('/loan/age-distribution', async (req, res) => {
    try {
        console.log('Fetching loan data for age distribution...');
        
        // Fetch all loans
        const loans = await LoanModel.find();

        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loan data found' });
        }

        // Initialize age groups
        const ageGroups1 = loans.filter(loan => loan.age >= 18 && loan.age <= 25);
        const ageGroups2 = loans.filter(loan => loan.age >= 26 && loan.age <= 35);
        const ageGroups3 = loans.filter(loan => loan.age >= 36 && loan.age <= 50);
        const ageGroups4 = loans.filter(loan => loan.age > 50);

        // Aggregate results (Optional: Send counts instead of raw data)
        res.status(200).json({
            group18_25: ageGroups1.length,
            group26_35: ageGroups2.length,
            group36_50: ageGroups3.length,
            groupAbove50: ageGroups4.length,
        });
    } catch (error) {
        console.error('Error fetching age distribution data:', error.message, error.stack);
        res.status(500).json({
            message: 'Error fetching age distribution data',
            error: error.message,
        });
    }
});

app.get('/loan/total-loan-amount', async (req, res) => {
    try {
        console.log('Calculating total and average loan amounts by loan type...');

        // Fetch all loans
        const loans = await LoanModel.find();

        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loan data found' });
        }

        // Calculate the total loan amount, ensuring valid numbers
        const totalLoanAmount = loans.reduce((sum, loan) => {
            const amount = loan.loanAmount;
            return sum + (typeof amount === 'number' && !isNaN(amount) ? amount : 0);
        }, 0);

        // Calculate the average loan amount
        const averageLoanAmount = totalLoanAmount / loans.length;

        // Initialize loan type specific totals
        const educationalLoanAmount = loans
            .filter(loan => loan.loanType === 'educational')
            .reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);

        const personalLoanAmount = loans
            .filter(loan => loan.loanType === 'personal')
            .reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);

        const pensionerLoanAmount = loans
            .filter(loan => loan.loanType === 'pensioner')
            .reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);

        // Format the total and average loan amounts with two decimal places
        const formattedTotalLoanAmount = totalLoanAmount.toFixed(2);
        const formattedAverageLoanAmount = averageLoanAmount.toFixed(2);

        const formattedEducationalLoanAmount = educationalLoanAmount.toFixed(2);
        const formattedPersonalLoanAmount = personalLoanAmount.toFixed(2);
        const formattedPensionerLoanAmount = pensionerLoanAmount.toFixed(2);

        res.status(200).json({
            totalLoanAmount: formattedTotalLoanAmount,
            averageLoanAmount: formattedAverageLoanAmount,
            educationalLoanAmount: formattedEducationalLoanAmount,
            personalLoanAmount: formattedPersonalLoanAmount,
            pensionerLoanAmount: formattedPensionerLoanAmount,
        });
    } catch (error) {
        console.error('Error calculating loan amounts:', error.message, error.stack);
        res.status(500).json({
            message: 'Error calculating loan amounts',
            error: error.message,
        });
    }
});

app.get('/loan/payment-status', async (req, res) => {
    try {
        console.log('Counting paid and overdue payment statuses...');

        // Fetch all loans
        const loans = await LoanModel.find();

        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loan data found' });
        }

        // Count the paid loans
        const paidLoans = loans.filter(loan => loan.paymentStatus === 'paid').length;

        // Count the overdue loans
        const overdueLoans = loans.filter(loan => loan.paymentStatus === 'overdue').length;

        // Respond with the counts of paid and overdue loans
        res.status(200).json({
            paidLoansCount: paidLoans,
            overdueLoansCount: overdueLoans,
        });

    } catch (error) {
        console.error('Error counting payment statuses:', error.message, error.stack);
        res.status(500).json({
            message: 'Error counting payment statuses',
            error: error.message,
        });
    }
});

app.get('/loan/approved/count', async (req, res) => {
    try {
      const approvedLoansCount = await LoanModel.countDocuments({ defaultStatus: 'Approved' });
      res.json({ count: approvedLoansCount });
    } catch (error) {
      console.error('Error fetching approved loans:', error);
      res.status(500).send({ error: 'Failed to fetch approved loans count' });
    }
  });
  
  app.get('/loan/review/count', async (req, res) => {
    try {
        const reviewApplicationsCount = await LoanModel.countDocuments({ defaultStatus: 'Review' });
        res.json({ count: reviewApplicationsCount });
    } catch (error) {
        console.error('Error fetching review applications count:', error);
        res.status(500).send({ error: 'Failed to fetch review applications count' });
    }
});
app.get('/loan/rejected/count', async (req, res) => {
    try {
        const rejectedApplicationsCount = await LoanModel.countDocuments({ defaultStatus: 'Rejected' });
        res.json({ count: rejectedApplicationsCount });
    } catch (error) {
        console.error('Error fetching rejected applications count:', error);
        res.status(500).send({ error: 'Failed to fetch rejected applications count' });
    }
});

app.get('/api/borrower/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const borrower = await LoanModel.findById(id); // Use findById for MongoDB models.
  
      if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
      }
  
      res.json(borrower);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/cashflow/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const cashflow = await Cashflow.findOne({ loanId: id }); // Use findOne with loanId field.
  
      if (!cashflow) {
        return res.status(404).json({ error: 'Cashflow entry not found' });
      }
  
      res.json(cashflow);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/comaker/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the co-maker entry by loanId
      const comaker = await ComakerModel.findOne({ loanId: id });
  
      // Handle case where no co-maker is found
      if (!comaker) {
        return res.status(404).json({ error: 'Co-maker entry not found' });
      }
  
      // Return the found co-maker entry
      res.status(200).json(comaker);
    } catch (error) {
      console.error('Error fetching co-maker:', error); // Log the error for debugging
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/statusget/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Ensure the id is converted to an ObjectId correctly
      const objectId = new mongoose.Types.ObjectId(id);
  
      // Query the LoanModel for userId and project only the defaultStatus field
      const status = await LoanModel.findOne({ userId: objectId }, 'defaultStatus');
  
      if (!status) {
        console.log(`No status entry found for userId: ${id}`);
        return res.status(404).json({ error: 'status entry not found' });
      }
  
      // Log the defaultStatus for verification
      console.log(`defaultStatus for userId ${id}:`, status.defaultStatus);
  
      res.json({ defaultStatus: status.defaultStatus });
    } catch (error) {
      console.error('Error fetching defaultStatus:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/users/:userId',  async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId); // Database query
        if (user) {
            res.json({ username: user.username });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/api/payment', upload.none(), async (req, res) => {
    try {
        console.log('Received Body:', req.body);

        const { loanId, amountDue, paymentDate, paymentStatus } = req.body;

        // Validate required fields
        if (!loanId || !amountDue || !paymentDate || !paymentStatus) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new payment document
        const payment = new PaymentModel({
            loanId,
            amountDue,
            paymentDate,
            paymentStatus,
        });

        // Save to MongoDB
        const savedPayment = await payment.save();
        console.log('Saved Payment:', savedPayment);

        res.status(201).json({
            message: 'Payment submitted successfully',
            data: savedPayment,
        });
    } catch (error) {
        console.error('Error saving payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/payments/:loanId', async (req, res) => {
    const { loanId } = req.params; // Get loanId from URL

    try {
        // Query the database for payments related to the loanId
        const payments = await PaymentModel.find({ loanId });  // Assuming the Payment model has a loanId field

        if (!payments) {
            return res.status(404).json({ error: 'Payments not found for this loan' });
        }

        // Return the payments
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put("/payment/edit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
  
      // Find and update the payment
      const updatedPayment = await PaymentModel.findByIdAndUpdate(
        id,
        { paymentStatus },
        { new: true } // Return the updated document
      );
  
      if (!updatedPayment) {
        return res.status(404).json({ message: "Payment not found" });
      }
  
      res.json(updatedPayment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/toget/payment/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if id is a valid MongoDB ObjectId
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid userId' });
      }
  
      const userId = new mongoose.Types.ObjectId(id);
  
      // Find the loan associated with the userId
      const loan = await LoanModel.findOne({ userId }, '_id');
      if (!loan) {
        console.log(`No loan entry found for userId: ${id}`);
        return res.status(404).json({ error: 'Loan not found' });
      }
  
      const loanId = loan._id;
      console.log(`Loan ID for userId ${id}:`, loanId);
  
      // Find payments associated with the loanId
      const payments = await PaymentModel.find({ loanId });
      if (payments.length === 0) {
        console.log(`No payments found for loanId: ${loanId}`);
        return res.status(404).json({ error: 'Payments not found' });
      }
  
      // Respond with the payments
      res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
