import React, { useState } from 'react';
import './appform.css'; // This file will contain the necessary CSS
import Footer from './footer';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from 'react-modal';
import BorrowerHeader from './borrowerheader';
import './borrowerdash.css'; 
import L from 'leaflet';
import { jwtDecode } from 'jwt-decode';

const icon = L.icon({
    iconUrl: 'src/to/pin.jpg', // Provide your custom marker icon path here
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
});

const LocationPin = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e?.latlng || {};
            if (lat !== undefined && lng !== undefined) {
                onLocationSelect([lat, lng]);
            } else {
                console.error("Error: Location data is undefined.");
            }
        }
    });
    return null;
};

const getUserIdFromToken = () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        console.error('No token found. Please log in.');
        return null; // Handle the absence of a token appropriately
    }

    try {
        const decodedToken = jwtDecode(token); // Decode the token
        const userId = decodedToken.id; // Replace 'id' with the actual key for the user ID in your token payload
        console.log('User ID:', userId); // Log or use the user ID
        return userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Example Usage
const userId = getUserIdFromToken();
if (userId) {
    console.log(`Extracted User ID: ${userId}`);
}


const Appform = () => {
    const navigate = useNavigate();
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [location, setLocation] = useState(null); 
    const [newRe, setNewRe] = useState("");
    const [branch, setBranch] = useState("Tibanga-Main");
    const [applicationDate, setApplicationDate] = useState("");
    const [applicantName, setApplicantName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [permanentAddress, setPermanentAddress] = useState("");
    const [presentAddress, setPresentAddress] = useState("");
    const [telMob, setTelMob] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("female");
    const [civilStatus, setCivilStatus] = useState("single");
    const [spouseName, setSpouseName] = useState("");
    const [spouseOccu, setSpouseOccu] = useState("");
    const locationString = location ? `Latitude: ${location[0]}, Longitude: ${location[1]}` : '';
    const [loanType, setLoanType] = useState("personal");
    const [loanAmount, setLoanAmount] = useState("");
    const [loanTerm, setLoanTerm] = useState("");
    const [purposeLoan, setPurposeLoan] = useState("");
    const [employer, setEmployer] = useState("");
    const [empCon, setEmpCon] = useState("");
    const [empStatus, setEmpStatus] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessAdd, setBusinessAdd] = useState("");
    const [lengthMem, setLengthMem] = useState("");
    const [shareCapital, setShareCapital] = useState("");
    const [savingsDepo, setSavingsDepo] = useState("");
    const [otherDepo, setOtherDepo] = useState("");
    const [collateral, setCollateral] = useState("");
    const [collateralText, setCollateralText] = useState("");
    const [sourcePay, setSourcePay] = useState("");
    const [sourcePayText, setSourcePayText] = useState("");
    const [modePay, setModePay] = useState("");
    const [mannerPay, setMannerPay] = useState("");
    const [memberSig, setMemberSig] = useState(null);
    const [spouseSig, setSpouseSig] = useState(null);
    const [interestRate] = useState("0");
    const [disbursementDate] = useState(() => {
        const now = new Date();
        return now.toISOString().split("T")[0];
      });
    const [paymentStatus] = useState("upcoming");
    const [defaultStatus] = useState("pending");
    const [verifiedby] = useState("admin");
    const [riskRating] = useState("low");
    const [approvalDate] = useState(() => {
        const now = new Date();
        return now.toISOString().split("T")[0];
      });
    const [notes] = useState("notes");
    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    const handleCollateralChange = (value) => {
        setCollateral(value);
        if (value !== "others") {
            setCollateralText(""); // Clear the text input when "Others" is deselected
        }
    };
    const handleSourcePayChange = (value) => {
        setSourcePay(value);
        if (value !== 'others') {
            setSourcePayText(""); // Clear the textarea if not "Others"
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate the "Others" fields for collateral and sourcePay
        let selectedCollateral = collateral;
        if (collateral === 'others') {
            if (!collateralText.trim()) {
                alert('Please specify the collateral for "Others".');
                return;
            }
            selectedCollateral = collateralText.trim();
        }
    
        let selectedSourcePay = sourcePay;
        if (sourcePay === 'others') {
            if (!sourcePayText.trim()) {
                alert('Please specify the Source of Payment for "Others".');
                return;
            }
            selectedSourcePay = sourcePayText.trim();
        }
    
        // Validate required fields
        if (!branch || !applicationDate || !newRe) {
            const missingFields = [];
            if (!branch) missingFields.push("Branch");
            if (!applicationDate) missingFields.push("Application Date");
            if (!newRe) missingFields.push("Application Type");
            alert(`All fields are required! Missing: ${missingFields.join(', ')}`);
            return;
        }
    
        // Prepare FormData object
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('branch', branch);
        formData.append('applicationDate', applicationDate);
        formData.append('newRe', newRe);
        formData.append('applicantName', applicantName);
        formData.append('emailAddress', emailAddress);
        formData.append('permanentAddress', permanentAddress);
        formData.append('presentAddress', presentAddress);
        formData.append('telMob', telMob);
        formData.append('age', age);
        formData.append('sex', sex);
        formData.append('civilStatus', civilStatus);
        formData.append('spouseName', spouseName);
        formData.append('spouseOccu', spouseOccu);
        formData.append('location', locationString); // Modify if needed
        formData.append('loanType', loanType);
        formData.append('loanAmount', loanAmount);
        formData.append('loanTerm', loanTerm);
        formData.append('purposeLoan', purposeLoan);
        formData.append('employer', employer);
        formData.append('empCon', empCon);
        formData.append('empStatus', empStatus);
        formData.append('businessName', businessName);
        formData.append('businessAdd', businessAdd);
        formData.append('lengthMem', lengthMem);
        formData.append('shareCapital', shareCapital);
        formData.append('savingsDepo', savingsDepo);
        formData.append('otherDepo', otherDepo);
        formData.append('collateral', selectedCollateral);
        formData.append('sourcePay', selectedSourcePay);
        formData.append('modePay', modePay);
        formData.append('mannerPay', mannerPay);
        formData.append('interestRate', interestRate);
        formData.append('disbursementDate', disbursementDate);
        formData.append('paymentStatus', paymentStatus);
        formData.append('defaultStatus', defaultStatus);
        formData.append('riskRating', riskRating);
        formData.append('verifiedby', verifiedby);
        formData.append('approvalDate', approvalDate);
        formData.append('notes', notes);
    
        // Append images if provided
        if (memberSig) formData.append('memberSig', memberSig);
        if (spouseSig) formData.append('spouseSig', spouseSig);
    
        console.log('Submitting data:', formData); // Log for debugging
    
        try {
            const response = await axios.post('http://192.168.1.82:3001/loan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201) {
                const { _id } = response.data;
                navigate(`/cashflow?loanId=${_id}`); // Adjust navigation path if needed
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
            } else {
                alert('Something went wrong.');
            }
        } catch (error) {
            console.error('Error submitting loan:', error.response?.data || error.message);
            alert(error.response?.data?.error || 'Error submitting loan. Please check your input.');
        }
    };
    

    const handleLocationSelect = (selectedLocation) => {
        setLocation(selectedLocation); // Store selected location
        setIsMapVisible(false); // Optionally close the map after selection
    };
    const showMap = () => {
        setIsMapVisible(true); // show map when called
    };

    return (
        <div className="application-form-pageapp">
            {/* Header Section */}
                     <BorrowerHeader /> 

            {/* Form Container */}
            
            <div className="sulodPorm">
            <h3 className="lontaytel">Loan Application Form</h3>
                <form className="porm"  onSubmit={handleSubmit}>
                    <div className="plesDet">
                        <div className="lugar"> 
                            <label htmlFor="branch">BRANCH</label>
                            <select 
                                id="branch" 
                                name="branch" 
                                required 
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}  
                            >
                                <option value="Tibanga-Main">Tibanga-Main</option>
                                <option value="Pala-o">Pala-o</option>
                                <option value="Buru-un">Buru-un</option>
                                <option value="Kiwalan">Kiwalan</option>
                                <option value="Poblacion">Poblacion</option>
                                <option value="Suarez-Tominobo">Suarez-Tominobo</option>
                                <option value="Tubod Iligan">Tubod Iligan</option>
                            </select>
                        </div>

                    <div className="det">
                        <label htmlFor="applicationDate">DATE FILED</label>
                        <input
                            type="date"
                            id="applicationDate"
                            name="applicationDate"
                            required
                            className="date-input"
                            value={applicationDate} 
                            onChange={(e) => setApplicationDate(e.target.value)} 
                        />
                    </div>

                    <div className="bago"> 
                        <div className="application-type">
                            <label className="pili">
                                <input 
                                    type="radio" 
                                    name="applicationType" 
                                    value="new" 
                                    checked={newRe === 'new'}
                                    onChange={() => setNewRe('new')}
                                />
                                <span className="checkmarkapp"></span>
                                New
                            </label>
                            <label className="pili">
                                <input 
                                    type="radio" 
                                    name="applicationType" 
                                    value="renewal" 
                                    checked={newRe === 'renewal'}
                                    onChange={() => setNewRe('renewal')}
                                />
                                <span className="checkmarkapp"></span>
                                Renewal
                            </label>
                        </div>
                    </div>
                </div>
                    <div className="isa">
                        <div className="pormleft">
                            <div className="fillupan">
                                <label htmlFor="applicantName">Name:</label>
                                <input 
                                    type="text" 
                                    id="applicantName" 
                                    name="applicantName" 
                                    value={applicantName} // Access from state
                                    onChange={(e) => setApplicantName(e.target.value)} // Update state
                                    required 
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="emailAddress">Email Address:</label>
                                <input 
                                    type="text" 
                                    id="emailAddress" 
                                    name="emailAddress" 
                                    value={emailAddress} // Access from state
                                    onChange={(e) => setEmailAddress(e.target.value)} // Update state
                                    required 
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="permanentAddress">Permanent Address:</label>
                                <textarea 
                                    id="permanentAddress" 
                                    name="permanentAddress" 
                                    value={permanentAddress} // Access from state
                                    onChange={(e) => setPermanentAddress(e.target.value)} // Update state
                                    required
                                ></textarea>
                            </div>

                            <div className="fillupan">
                                <label htmlFor="presentAddress">Present Address:</label>
                                <textarea 
                                    id="presentAddress" 
                                    name="presentAddress" 
                                    value={presentAddress} // Access from state
                                    onChange={(e) => setPresentAddress(e.target.value)} // Update state
                                    required
                                ></textarea>
                            </div>

                            <div className="fillupan">
                                <label htmlFor="telMob">Telephone/Mobile No.:</label>
                                <input 
                                    type="text" 
                                    id="telMob" 
                                    name="telMob" 
                                    value={telMob} // Access from state
                                    onChange={(e) => setTelMob(e.target.value)} // Update state
                                    required 
                                />
                            </div>

                            <div className="ageapp">
                                <label htmlFor="age">Age:</label>
                                <input 
                                    type="text" 
                                    id="age" 
                                    name="age" 
                                    value={age} // Access from state
                                    onChange={(e) => setAge(e.target.value)} // Update state
                                    required 
                                />
                            </div>

                            <div className="genderapp">
                                <label htmlFor="sex">Sex:</label>
                                <select 
                                    id="sex" 
                                    name="sex" 
                                    required 
                                    value={sex} // Access from state
                                    onChange={(e) => setSex(e.target.value)} // Update state
                                >
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </select>
                            </div>

                            <div className="civilapp">
                                <label htmlFor="civilStatus">Civil Status:</label>
                                <select 
                                    id="civilStatus" 
                                    name="civilStatus" 
                                    required 
                                    value={civilStatus} // Access from state
                                    onChange={(e) => setCivilStatus(e.target.value)} // Update state
                                >
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>

                            <div className="fillupan">
                                <label htmlFor="spouseName">Name of Spouse:</label>
                                <input 
                                    type="text" 
                                    id="spouseName" 
                                    name="spouseName" 
                                    value={spouseName} // Access from state
                                    onChange={(e) => setSpouseName(e.target.value)} // Update state
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="spouseOccu">Spouse Occupation:</label>
                                <input 
                                    type="text" 
                                    id="spouseOccu" 
                                    name="spouseOccu" 
                                    value={spouseOccu} // Access from state
                                    onChange={(e) => setSpouseOccu(e.target.value)} // Update state
                                />
                            </div>

                            
                            <div className="form-row-checkbox-upload-date">
                                <div className="checkboxq-groupapp">
                                    <label class="pili">Share Residence Location</label>
                                </div>
                                <div className="sher">
                                <textarea 
                                    onClick={showMap}
                                    type="text"
                                    id="locationll" 
                                    name="locationll" 
                                    value={locationString}
                                        placeholder="Please select your location on the map"
                                        readOnly
                                        className="location-input"
                                    onChange={(e) => setLocationll(e.target.value)} // Update state
                                    required
                                ></textarea>
                    
                                    {isMapVisible && (
                                        <div className="map">
                                            <p>Select a location on the map.</p>
                                        </div>
                                    )}
                                </div>

                                    

                                {/* Modal for Map with Pin */}
                                <Modal
                                    isOpen={isMapVisible}
                                    onRequestClose={() => setIsMapVisible(false)}
                                    contentLabel="Select Residence Location"
                                    className="map-modal"
                                    overlayClassName="map-modal-overlay"
                                >
                                    <MapContainer
                                        center={[8.2265, 124.2497]} 
                                        zoom={13}
                                        style={{ height: "500px", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                                        />
                                        {/* Pin marker when user clicks */}
                                        {location && (
                                            <Marker position={location} icon={icon}>
                                                <Popup>
                                                    Selected Location: <br /> Latitude: {location[0]} <br /> Longitude: {location[1]}
                                                </Popup>
                                            </Marker>
                                        )}
                                        <LocationPin onLocationSelect={handleLocationSelect} />
                                    </MapContainer>
                                </Modal>
                            </div>
                        </div>


                        <div className="pormrayt">
                            <div className="fillupan">
                                <label htmlFor="loanType">Loan Type:</label>
                                <select 
                                    id="loanType" 
                                    name="loanType" 
                                    required 
                                    value={loanType} // Access from state
                                    onChange={(e) => setLoanType(e.target.value)} // Update state
                                >
                                    <option value="personal">Personal Loan</option>
                                    <option value="educational">Educational Loan</option>
                                    <option value="pensioner">Pensioner Loan</option>
                                </select>
                            </div>

                            <div className="fillupan">
                                <label htmlFor="loanAmount">Amount Applied:</label>
                                <input 
                                    type="text" 
                                    id="loanAmount" 
                                    name="loanAmount" 
                                    value={loanAmount} // Access from state
                                    onChange={(e) => setLoanAmount(e.target.value)} // Update state
                                    required 
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="loanTerm">Term of Loan (in month):</label>
                                <input 
                                    type="text" 
                                    id="loanTerm" 
                                    name="loanTerm" 
                                    value={loanTerm} // Access from state
                                    onChange={(e) => setLoanTerm(e.target.value)} // Update state
                                    required 
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="purposeLoan">Purpose of Loan:</label>
                                <textarea 
                                    id="purposeLoan" 
                                    name="purposeLoan" 
                                    value={purposeLoan} // Access from state
                                    onChange={(e) => setPurposeLoan(e.target.value)} // Update state
                                    required
                                ></textarea>
                            </div>

                            <div className="fillupan">
                                <label htmlFor="employer">Employer:</label>
                                <input 
                                    type="text" 
                                    id="employer" 
                                    name="employer" 
                                    value={employer} // Access from state
                                    onChange={(e) => setEmployer(e.target.value)} // Update state
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="empCon">Employer Contact No.:</label>
                                <input 
                                    type="text" 
                                    id="empCon" 
                                    name="empCon" 
                                    value={empCon} // Access from state
                                    onChange={(e) => setEmpCon(e.target.value)} // Update state
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="empStatus">Employment Status/Position Held:</label>
                                <input 
                                    type="text" 
                                    id="empStatus" 
                                    name="empStatus" 
                                    value={empStatus} // Access from state
                                    onChange={(e) => setEmpStatus(e.target.value)} // Update state
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="businessName">Business Name:</label>
                                <input 
                                    type="text" 
                                    id="businessName" 
                                    name="businessName" 
                                    value={businessName} // Access from state
                                    onChange={(e) => setBusinessName(e.target.value)} // Update state
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="businessAdd">Business Address:</label>
                                <input 
                                    type="text" 
                                    id="businessAdd" 
                                    name="businessAdd" 
                                    value={businessAdd} // Access from state
                                    onChange={(e) => setBusinessAdd(e.target.value)} // Update state
                                />
                            </div>

                            <div className="fillupan">
                                <label htmlFor="lengthMem">Length of Coop Membership (in month):</label>
                                <input 
                                    type="text" 
                                    id="lengthMem" 
                                    name="lengthMem" 
                                    value={lengthMem} // Access from state
                                    onChange={(e) => setLengthMem(e.target.value)} // Update state
                                    required 
                                />
                            </div>

                            <div className="fillupan">
                                <label>Account Balance</label>
                                <div className="balanceFields">
                                <label htmlFor="shareCapital">Share Capital:</label>
                                <input 
                                    type="text" 
                                    id="shareCapital" 
                                    name="shareCapital" 
                                    value={shareCapital} // Access from state
                                    onChange={(e) => setShareCapital(e.target.value)} // Update state
                                    required 
                                />
                                <label htmlFor="savingsDepo">Savings Deposit:</label>
                                <input 
                                    type="text" 
                                    id="savingsDepo" 
                                    name="savingsDepo" 
                                    value={savingsDepo} // Access from state
                                    onChange={(e) => setSavingsDepo(e.target.value)} // Update state
                                    required 
                                />
                                <label htmlFor="otherDepo">Other Deposit:</label>
                                <input 
                                    type="text" 
                                    id="otherDepo" 
                                    name="otherDepo" 
                                    value={otherDepo} // Access from state
                                    onChange={(e) => setOtherDepo(e.target.value)} // Update state
                                />
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="form-rowapp">
                            <div class="column-1app">
                                <div className="fillupan">
                                    <label htmlFor="payment">Collateral/Security Offered</label>
                                    <div className="checkbox-groupapp">
                                        <label class="pili1">Real Estate
                                            <input
                                                type="checkbox"
                                                name="collateral" 
                                                value="real-estate"
                                                checked={collateral==='real-estate'}
                                                onChange={() => handleCollateralChange('real-estate')}
                                            />
                                            <span class="checkmarkapp"></span>
                                        </label>
                                            <label class="pili1">Vehicle
                                            <input
                                                type="checkbox"
                                                name="collateral" 
                                                value="vehicle"
                                                checked={collateral==='vehicle'}
                                                onChange={() => handleCollateralChange('vehicle')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            </label>
                                        <label class="pili1">ATM Deposit
                                        <input
                                            type="checkbox"
                                            name="collateral" 
                                            value="atm-deposit"
                                            checked={collateral==='atm-deposit'}
                                            onChange={() => handleCollateralChange('atm-deposit')}
                                        />
                                        <span class="checkmarkapp"></span>
                                        
                                        </label>
                                        <label class="pili1">Savings/Time Deposit
                                            <input
                                                type="checkbox"
                                                name="collateral" 
                                                value="savings-deposit"
                                                checked={collateral==='savings-deposit'}
                                                onChange={() => handleCollateralChange('savings-deposit')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            
                                        </label>
                                        <label class="pili1">Others
                                            <input
                                                type="checkbox"
                                                name="collateral" 
                                                value="others"
                                                checked={collateral==='others'}
                                                onChange={() => handleCollateralChange('others')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            
                                        </label>
                                        {collateral.includes("others") && (
                                            <textarea
                                                id="otherCollateral"
                                                value={collateralText}
                                                onChange={(e) => setCollateralText(e.target.value)}
                                                placeholder="Specify other collateral"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Source of Payment */}
                            <div class="column-1app">
                            <div class="fillupan">
                                <label for="payment">Source of Payment</label>
                                <div className="checkbox-groupapp">
                                    <label class="pili1">Salary
                                    <input
                                        type="checkbox"
                                        name="sourcePay" 
                                        value="salary"
                                        checked={sourcePay==='salary'}
                                        onChange={() => handleSourcePayChange('salary')}
                                    />
                                    <span class="checkmarkapp"></span>
                                
                                    </label>
                                    <label class="pili1">Pension
                                    <input
                                        type="checkbox"
                                        name="sourcePay" 
                                        value="pension"
                                        checked={sourcePay==='pension'}
                                        onChange={() => handleSourcePayChange('pension')}
                                    />
                                    <span class="checkmarkapp"></span>
                                    
                                    </label>
                                    <label class="pili1">Allotment
                                    <input
                                        type="checkbox"
                                        name="sourcePay" 
                                        value="allotment"
                                        checked={sourcePay==='allotment'}
                                        onChange={() => handleSourcePayChange('allotment')}
                                    />
                                    <span class="checkmarkapp"></span>
                                    
                                    </label>
                                    <label class="pili1">Commission
                                    <input
                                        type="checkbox"
                                        name="sourcePay" 
                                        value="commission"
                                        checked={sourcePay==='commission'}
                                        onChange={() => handleSourcePayChange('commission')}
                                    />
                                    <span class="checkmarkapp"></span>
                                        
                                    </label>
                                    <label class="pili1">Income from Business
                                    <input
                                        type="checkbox"
                                        name="sourcePay" 
                                        value="income-business"
                                        checked={sourcePay==='income-business'}
                                        onChange={() => handleSourcePayChange('income-business')}
                                    />
                                    <span class="checkmarkapp"></span>
                                        
                                    </label>
                                    <label class="pili1">Financial Assistance
                                    <input
                                        type="checkbox"
                                        name="sourcePay" 
                                        value="financial-assistance"
                                        checked={sourcePay==='financial-assistance'}
                                        onChange={() => handleSourcePayChange('financial-assistance')}
                                    />
                                    <span class="checkmarkapp"></span>
                                        
                                    </label>
                                    <label class="pili1">Others
                                    <input
                                        type="checkbox"
                                        name="sourcePay" 
                                        value="others"
                                        checked={sourcePay==='others'}
                                        onChange={() => handleSourcePayChange('others')}
                                    />
                                    <span class="checkmarkapp"></span>
                                        
                                    </label>
                                    {sourcePay.includes("others") && (
                                        <textarea
                                            id="otherSourcePay"
                                            value={sourcePayText}
                                            onChange={(e) => setSourcePayText(e.target.value)}
                                            placeholder="Specify other source of payment"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div class="column-1app">
                            <div class="fillupan">
                                <label for="payment">Mode of Payment</label>
                                <div className="checkbox-groupapp">
                                    <label class="pili1">Daily
                                    <input
                                        type="checkbox"
                                        name="modePay" 
                                        value="daily"
                                        checked={modePay=== 'daily'}
                                        onChange={() => setModePay('daily')}
                                    />
                                    <span class="checkmarkapp"></span>
                                    
                                    </label>
                                    <label class="pili1">Weekly
                                    <input
                                        type="checkbox"
                                        name="modePay" 
                                        value="weekly"
                                        checked={modePay=== 'weekly'}
                                        onChange={() => setModePay('weekly')}
                                    />
                                    <span class="checkmarkapp"></span>
                                        
                                    </label>
                                    <label class="pili1">Monthly
                                    <input
                                        type="checkbox"
                                        name="modePay" 
                                        value="monthly"
                                        checked={modePay=== 'monthly'}
                                        onChange={() => setModePay('monthly')}
                                    />
                                    <span class="checkmarkapp"></span>
                                        
                                    </label>
                                    <label class="pili1">Quarterly
                                    <input
                                        type="checkbox"
                                        name="modePay" 
                                        value="quarterly"
                                        checked={modePay=== 'quarterly'}
                                        onChange={() => setModePay('quarterly')}
                                    />
                                    <span class="checkmarkapp"></span>
                                    </label>
                                </div>
                            </div>

                            </div>

                            <div class="column-1app">
                                <div class="fillupan">
                                    <label for="payment">Manner of Payment</label>
                                    <div className="checkbox-groupapp">
                                        <label class="pili1">Thru Coop/OTC
                                            <input
                                                type="checkbox"
                                                name="mannerPay" 
                                                value="otc"
                                                checked={mannerPay==='otc'}
                                                onChange={() => setMannerPay('otc')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            
                                        </label>
                                        <label class="pili1">Collector
                                            <input
                                                type="checkbox"
                                                name="mannerPay" 
                                                value="collector"
                                                checked={mannerPay==='collector'}
                                                onChange={() => setMannerPay('collector')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            
                                        </label>
                                        <label class="pili1">Payroll Deduction
                                            <input
                                                type="checkbox"
                                                name="mannerPay" 
                                                value="payroll"
                                                checked={mannerPay==='payroll'}
                                                onChange={() => setMannerPay('payroll')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            
                                        </label>
                                        <label class="pili1">PDC
                                            <input
                                                type="checkbox"
                                                name="mannerPay" 
                                                value="pdc"
                                                checked={mannerPay==='pdc'}
                                                onChange={() => setMannerPay('pdc')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            
                                        </label>
                                        <label class="pili1">Auto-Debit
                                            <input
                                                type="checkbox"
                                                name="mannerPay" 
                                                value="auto-debit"
                                                checked={mannerPay==='auto-debit'}
                                                onChange={() => setMannerPay('auto-debit')}
                                            />
                                            <span class="checkmarkapp"></span>
                                            
                                        </label>
                                    </div>
                                </div>
                            </div>
                    </div>
                    
                    <p className="aboutp">
                        I warrant the truth and correctness of all data 
                        and information herein to the best of my knowledge. 
                        I expressly submit to any credit investigation and hereby agree that 
                        any false information that will be discovered will automatically cause
                        the disapproval of this application.
                    </p>
                    <br></br>

                    {/* Upload Signature and Date */}
                    <div className="form-rowapp">
                        <div className="columnapp">
                            <div className="form-groupapp">
                                <label htmlFor="borrower-signature">Member-Borrower’s Signature:</label>
                                <input
                                    type="file"
                                    id="borrower-signature"
                                    name="memberSig"
                                    onChange={(e) => handleFileChange(e, setMemberSig)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="columnapp">
                            <div className="form-groupapp">
                                <label htmlFor="spouse-signature">Spouse’s Signature:</label>
                                <input
                                    type="file"
                                    id="spouse-signature"
                                    name="spouseSig"
                                    onChange={(e) => handleFileChange(e, setSpouseSig)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="parent-containerapp">
                         <button type="submit" className="submit-btn">Next →</button>
                    </div>


                </form>
            </div>

         <Footer />
        </div>
        );

    };

export default Appform;