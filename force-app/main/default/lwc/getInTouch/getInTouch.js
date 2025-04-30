import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/IMAGES';
import createCaseFromGetInTouchForm from '@salesforce/apex/YotiSupportSiteController.createCaseFromGetInTouchForm';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';


export default class GetInTouch extends LightningElement {

    @track isSuccess=false;
    @track showAlert=false;

    @track yourName = '';
    @track email = '';
    @track companyName = '';

    @track isYourNameInvalid = false;
    @track isCompanyNameInvalid = false;
    @track isEmailInvalid = false;

    @track businessEnquiryValue = '';

    @track isBusinessUser=false;
    @track isIndividualUser=false;

    @track selectedSupportTypeBusiness='';
    @track isSelectedSupportTypeBusinessInvalid=false;

    @track selectedSupportTypeIndividual='';
    @track isSelectedSupportTypeIndividualInvalid=false;

    @track isIndividualUserArticle=false;

    @track isProductDropdown=false;
    @track selectedProduct='';

    @track isInvoiceBillingDropdown=false;
    @track selectedInvoiceBilling='';

    @track isNewCustomer=false;
    @track isBusinessServiceOutage=false;
    @track isBusiness=false;

    @track isSessionQuerySupport=false;
    @track selectedSessionQuerySupport='';
    @track isSelectedSessionQuerySupportInvalid=false

    @track isReceiptIDInputBox=false;
    @track receiptID='';
    @track isReceiptIDInputBoxSupport=false;

    @track sdkIntegrationChecked=false;

    @track selectedTopic='';
    @track selectedLanguage='';
    @track selectedLoginIssue='';

    @track documentationUsefulValue='';
    @track isDocumentationUseful=false;

    @track howCanWeHelpValue='';
    @track isHowCanWeHelp=false;

    @track companyLabelClass = 'floating';
    @track yourNameLabelClass = 'floating';
    @track emailLabelClass = 'floating';
    @track sessionIDLabelClass = 'floating';
    @track receiptIDLabelClass = 'floating';

    @track isForgotPassword = false;
    @track isChangedPhone = false;
    @track isPasswordReset = false;
    @track isBug = false;
    @track isPortalAccess=false;
    @track isIntegration=false;
    @track isDocumentation=false;

    @track isRadioContainer=false;

    @track isLogin=false;
    @track isWalkthrough=false;

    @track isSDKIntegration=false;
    @track isTopicDropdown=false;

    @track isLanguageDropdown=false;

    @track isSessionQueryTopic=false;
    @track selectedSessionQueryTopic='';
    @track sessionID='';
    @track isSessionIDInputBoxTopic=false;

    chevronDown = IMAGES + '/chevron_down.png';
    newCustomer = IMAGES + '/NewCustomer.png';
    articleIcon = IMAGES + '/articleIcon.png';
    thankYouIcon = IMAGES + '/thankYouIcon.png';

    @track isMobileNavigation=false;

    receivedMessage;

    @wire(MessageContext)
    messageContext;


    handleMessage(message) {
        try {
            this.receivedMessage = message.messageText;
            if (
                this.receivedMessage === 'Hamburger Clicked' ||
                this.receivedMessage === 'Search Icon Clicked'
            ) {
                this.isMobileNavigation = true;
            } else {
                this.isMobileNavigation = false;
            }
        } catch (error) {
            console.error('Error in handleMessage:', error);
        }
    }
    
    connectedCallback() {
        try {
            let style = document.createElement('style');
            style.innerHTML = `
                .custom-dropdown::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                    width: 28px;
                    height: 28px;
                    background-image: url('${this.chevronDown}');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            `;
            document.head.appendChild(style);
    
            this.subscription = subscribe(this.messageContext, HMC, (message) => {
                this.handleMessage(message);
            });
        } catch (error) {
            console.error('Error in connectedCallback:', error);
        }
    }
    

    get yourNameInputClass() {
        return this.isYourNameInvalid ? 'input-error' : 'input-valid';
    }

    get companyNameInputClass() {
        return this.isCompanyNameInvalid ? 'input-error' : 'input-valid';
    }

    get emailInputClass(){
        return this.isEmailInvalid ? 'input-error' : 'input-valid';
    }

    get supportTypeClass() {
        return this.isSelectedSupportTypeBusinessInvalid ? 'wide-combobox input-error' : 'wide-combobox input-valid';
    }

    get sessionQuerySupportClass() {
        return this.isSelectedSessionQuerySupportInvalid ? 'wide-combobox input-error' : 'wide-combobox input-valid';
    }

    


    validateInputValue(name) {
        try {
            if (name === 'companyName') {
                this.isCompanyNameInvalid = this.companyName.trim() === '';
            }
            if (name === 'yourName') {
                this.isYourNameInvalid = this.yourName.trim() === '';
            }
            if (name === 'email') {
                this.isEmailInvalid = this.email.trim() === '';
            }
        } catch (error) {
            console.error('Error in validateInputValue:', error);
        }
    }
    


    get whatTypeOfUser(){
        if(this.isBusinessUser || this.isIndividualUser){
            return true;
        }else{
            return false;
        }
    }

    get selectedLabelClassSupportIndividual() {
        return this.selectedSupportTypeIndividual ? 'shrink' : '';
    }

    get selectedLabelClassSupportBusiness() {
        return this.selectedSupportTypeBusiness ? 'shrink' : '';
    }

    get selectedLabelClassInvoiceBilling(){
        return this.selectedInvoiceBilling ? 'shrink' : '';
    }

    get selectedLabelClassProduct() {
        return this.selectedProduct ? 'shrink' : '';
    }

    get selectedLabelClassTopic() {
        return this.selectedTopic ? 'shrink' : '';
    }

    get selectedLabelClassLanguage() {
        return this.selectedLanguage ? 'shrink' : '';
    }

    get selectedLabelClassLoginIssue() {
        return this.selectedLoginIssue ? 'shrink' : '';
    }

    get selectedLabelClassSessionQueryTopic(){
        return this.selectedSessionQueryTopic ? 'shrink' : '';
    }

    get selectedLabelClassSessionQuerySupport(){
        return this.selectedSessionQuerySupport ? 'shrink' : '';
    }


    resetAllValues() {
        try {
            this.selectedSupportTypeBusiness = '';
            this.resetApplicationSupportContainerValues();
            this.isInvoiceBillingDropdown = false;
            this.selectedInvoiceBilling = '';
            this.isNewCustomer = false;
            this.isBusinessServiceOutage = false;
            this.isBusiness = false;
            this.isSessionQuerySupport = false;
            this.selectedSessionQuerySupport = '';
            this.isReceiptIDInputBox = false;
            this.receiptID = '';
            this.isSessionIDInputBoxSupport = false;
            this.sessionID = '';
            this.isDocumentationUseful = false;
            this.documentationUsefulValue = '';
            this.selectedSupportTypeIndividual = '';
            this.isIndividualUserArticle = false;
            this.isHowCanWeHelp = false;
            this.howCanWeHelpValue = '';
        } catch (error) {
            console.error('Error in resetAllValues:', error);
        }
    }
    
    handleBusinessEnquiryInputChange(event) {
        try {
            this.businessEnquiryValue = event.target.value;
            this.resetAllValues();
            if (this.businessEnquiryValue === 'Yes') {
                this.isBusinessUser = true;
                this.isIndividualUser = false;
            } else {
                this.isBusinessUser = false;
                this.isIndividualUser = true;
            }
        } catch (error) {
            console.error('Error in handleBusinessEnquiryInputChange:', error);
        }
    }
    

    supportTypeIndividualOptions = [
        { label: 'None', value: '' },
        { label: 'Yoti Mobile App', value: 'Yoti Mobile App' },
        { label: 'Yoti Identity Checks', value: 'Yoti Identity Checks' },
        { label: 'Yoti eSignatures', value: 'Yoti eSignatures' },
        { label: 'Yoti Age Checks', value: 'Yoti Age Checks' },
        { label: 'Other', value: 'Other' }
    ];

    handleSupportTypeIndividualChange(event) {
        try {
            this.selectedSupportTypeIndividual = event.target.value;
            this.isHowCanWeHelp = false;
    
            if (this.selectedSupportTypeIndividual !== 'None') {
                this.isHowCanWeHelp = true;
                this.isIndividualUserArticle = true;
            }
    
            if (this.selectedSupportTypeIndividual === 'None') {
                this.isIndividualUserArticle = false;
            }
        } catch (error) {
            console.error('Error in handleSupportTypeIndividualChange:', error);
        }
    }
    


    supportTypeBusinessOptions = [
        { label: 'None', value: 'None' },
        { label: 'Application Support', value: 'Application Support' },
        { label: 'Invoices and Billing', value: 'Invoices and Billing' },
        { label: 'New Customer', value: 'New Customer' },
        { label: 'Session Query', value: 'Session Query' },
        { label: 'Business', value: 'Business' },
        { label: 'Other', value: 'Other' },
        { label: 'Business Service Outage', value: 'Business Service Outage' }
    ];

    handleSupportTypeBusinessChange(event) {
        try {
            this.selectedSupportTypeBusiness = event.target.value;
    
            if (this.selectedSupportTypeBusiness !== 'None') {
                this.isSelectedSupportTypeBusinessInvalid = false;
            } else {
                this.isSelectedSupportTypeBusinessInvalid = true;
            }
    
            this.isHowCanWeHelp = false;
    
            if (this.selectedSupportTypeBusiness === 'Application Support') {
                this.resetApplicationSupportContainerValues();
                this.isProductDropdown = true;
            } else {
                this.isProductDropdown = false;
            }
    
            if (this.selectedSupportTypeBusiness === 'Invoices and Billing') {
                this.isInvoiceBillingDropdown = true;
                this.selectedInvoiceBilling = '';
            } else {
                this.isInvoiceBillingDropdown = false;
            }
    
            if (this.selectedSupportTypeBusiness === 'New Customer') {
                this.isNewCustomer = true;
            } else {
                this.isNewCustomer = false;
            }
    
            if (this.selectedSupportTypeBusiness === 'Business Service Outage') {
                this.isBusinessServiceOutage = true;
                this.isHowCanWeHelp = true;
            } else {
                this.isBusinessServiceOutage = false;
            }
    
            if (this.selectedSupportTypeBusiness === 'Business') {
                this.isBusiness = true;
                this.isHowCanWeHelp = true;
            } else {
                this.isBusiness = false;
            }
    
            if (this.selectedSupportTypeBusiness === 'Other') {
                this.isHowCanWeHelp = true;
            }
    
            if (this.selectedSupportTypeBusiness === 'Session Query') {
                this.isSessionQuerySupport = true;
                this.selectedSessionQuerySupport = '';
                this.isReceiptIDInputBox = false;
                this.receiptID = '';
                this.isSessionIDInputBoxSupport = false;
                this.sessionID = '';
            } else {
                this.isSessionQuerySupport = false;
                this.selectedSessionQuerySupport = '';
                this.isReceiptIDInputBox = false;
                this.receiptID = '';
                this.isSessionIDInputBoxSupport = false;
                this.sessionID = '';
            }
        } catch (error) {
            console.error('Error in handleSupportTypeBusinessChange:', error);
        }
    }
    

    sessionQuerySupportOptions=[
        { label: 'None', value: 'None' },
        { label: 'IDV', value: 'IDV' },
        { label: 'Digital ID', value: 'Digital ID' }
    ]

    handleSessionQuerySupportChange(event) {
        try {
            const value = event.target.value;
            this.selectedSessionQuerySupport = value;
    
            if (this.selectedSessionQuerySupport !== 'None') {
                this.isSelectedSessionQuerySupportInvalid = false;
            } else {
                this.isSelectedSessionQuerySupportInvalid = true;
            }
    
            if (this.selectedSessionQuerySupport === 'None' || this.selectedSessionQuerySupport === '') {
                this.isReceiptIDInputBox = false;
                this.isHowCanWeHelp = false;
                this.isSessionIDInputBoxSupport = false;
            } else if (this.selectedSessionQuerySupport === 'Digital ID') {
                this.isReceiptIDInputBox = true;
                this.receiptID = '';
                this.isSessionIDInputBoxSupport = false;
                this.sessionID = '';
                this.isHowCanWeHelp = true;
            } else if (this.selectedSessionQuerySupport === 'IDV') {
                this.isSessionIDInputBoxSupport = true;
                this.sessionID = '';
                this.isReceiptIDInputBox = false;
                this.receiptID = '';
                this.isHowCanWeHelp = true;
            }
        } catch (error) {
            console.error('Error in handleSessionQuerySupportChange:', error);
        }
    }
    



    invoiceBillingOptions = [
        { label: 'None', value: 'None' },
        { label: 'Invoice Change', value: 'Invoice Change' },
        { label: 'Payment Query', value: 'Payment Query' },
        { label: 'Business Name Update', value: 'Business Name Update' },
        { label: 'Other', value: 'Other' }
    ];

    handleInvoiceBillingChange(event) {
        try {
            this.selectedInvoiceBilling = event.target.value;
            
            if (this.selectedInvoiceBilling === 'None') {
                this.isHowCanWeHelp = false;
            } else {
                this.isHowCanWeHelp = true;
            }
        } catch (error) {
            console.error('Error in handleInvoiceBillingChange:', error);
        }
    }
    

    productOptions = [
        { label: 'None', value: 'None' },
        { label: 'DBS & RTW/RTR', value: 'DBS & RTW/RTR' },
        { label: 'IDV', value: 'IDV' },
        { label: 'eSignatures', value: 'eSignatures' },
        { label: 'Age Verification', value: 'Age Verification' },
        { label: 'Age Estimation', value: 'Age Estimation' },
        { label: 'Digital ID', value: 'Digital ID' },
        { label: 'In-Branch Verification', value: 'In-Branch Verification' },
        { label: 'Health', value: 'Health' }
    ];

    handleProductChange(event) {
        try {
            this.selectedProduct = event.target.value;
            this.isTopicDropdown = false;
    
            if (this.selectedProduct === 'eSignatures' || this.selectedProduct === 'Age Verification' || this.selectedProduct === 'Health' || this.selectedProduct === 'None' || this.selectedProduct === '') {
                this.isSDKIntegration = false;
                this.isLanguageDropdown = false;
            } else {
                this.isSDKIntegration = true;
            }
    
            if (this.selectedProduct !== 'None' || this.selectedProduct !== '') {
                this.isTopicDropdown = true;
                if (this.selectedTopic === 'Envelope Status') {
                    this.selectedTopic = '';
                    this.isHowCanWeHelp = false;
                    this.howCanWeHelpValue = '';
                }
            }
    
            if (this.selectedProduct === 'Age Estimation' || this.selectedProduct === 'Age Verification' || this.selectedProduct === 'Health' || this.selectedProduct === 'Digital ID' || this.selectedProduct === 'In-Branch Verification') {
                this.selectedTopic = 'None';
                this.isRadioContainer = false;
                this.isHowCanWeHelp = false;
                this.isLogin = false;
                this.resetHelpfulArticleContainerValues();
                this.isSessionQueryTopic = false;
                this.sessionID = '';
                this.isSessionIDInputBoxTopic = false;
            }
        } catch (error) {
            console.error('Error in handleProductChange:', error);
        }
    }
    
    handleSdkIntegrationValueChange(event) {
        try {
            this.sdkIntegrationChecked = event.target.checked;
            if (this.sdkIntegrationChecked) {
                this.isLanguageDropdown = true;
            } else {
                this.isLanguageDropdown = false;
            }
        } catch (error) {
            console.error('Error in handleSdkIntegrationValueChange:', error);
        }
    }
    

    languageOptions = [
        { label: 'None', value: 'None' },
        { label: 'Java', value: 'Java' },
        { label: 'Javascript', value: 'Javascript' },
        { label: 'Ruby', value: 'Ruby' },
        { label: 'PHP', value: 'PHP' },
        { label: 'Python', value: 'Python' },
        { label: 'React', value: 'React' },
        { label: 'C#', value: 'CSharp' },
        { label: 'Go', value: 'Go' },
        { label: 'IOS', value: 'IOS' },
        { label: 'Android', value: 'Android' }
    ];

    handleLanguageChange(event) {
        try {
            this.selectedLanguage = event.target.value;
        } catch (error) {
            console.error('Error in handleLanguageChange:', error);
        }
    }
    

    allTopicOptions = [
        { label: 'None', value: 'None' },
        { label: 'Login', value: 'Login' },
        { label: 'Walkthrough', value: 'Walkthrough' },
        { label: 'Session Query', value: 'Session Query' },
        { label: 'Integration', value: 'Integration' },
        { label: 'Documentation', value: 'Documentation' },
        { label: 'Envelope Status', value: 'Envelope Status' },
        { label: 'Other', value: 'Other' }
    ];
    
    get topicOptions() {
        let filtered = [...this.allTopicOptions];

        if (this.selectedProduct === 'DBS & RTW/RTR' || this.selectedProduct === 'IDV') {
            filtered = filtered.filter(
                option => option.value !== 'Envelope Status'
            );
        } else if (this.selectedProduct === 'eSignatures') {
            filtered = filtered.filter(
                option => option.value !== 'Session Query'
            );
        } else {
            filtered = filtered.filter(
                option => option.value !== 'Login' && option.value !== 'Walkthrough' && option.value !== 'Session Query' && option.value !== 'Envelope Status'
            );
        }
        return filtered;
    }

    resetHelpfulArticleContainerValues() {
        try {
            this.isForgotPassword = false;
            this.isChangedPhone = false;
            this.isPasswordReset = false;
            this.isBug = false;
            this.isPortalAccess = false;
            this.isIntegration = false;
            this.isDocumentation = false;
        } catch (error) {
            console.error('Error in resetHelpfulArticleContainerValues:', error);
        }
    }
    
    resetApplicationSupportContainerValues() {
        try {
            this.isProductDropdown = false;
            this.selectedProduct = '';
            this.isSDKIntegration = false;
            this.sdkIntegrationChecked = false;
            this.isLanguageDropdown = false;
            this.isTopicDropdown = false;
            this.selectedTopic = '';
            this.isLogin = false;
            this.selectedLoginIssue = '';
            this.isSessionQueryTopic = false;
            this.selectedSessionQueryTopic = '';
            this.isSessionIDInputBoxTopic = false;
            this.sessionID = '';
            this.resetHelpfulArticleContainerValues();
            this.isRadioContainer = false;
            this.documentationUsefulValue = '';
            this.howCanWeHelpValue = '';
            this.isHowCanWeHelp = false;
        } catch (error) {
            console.error('Error in resetApplicationSupportContainerValues:', error);
        }
    }
    
    handleTopicChange(event) {
        try {
            this.selectedTopic = event.target.value;
            this.isHowCanWeHelp = false;
            this.resetHelpfulArticleContainerValues();
    
            if (this.selectedTopic === 'Login') {
                this.isLogin = true;
                this.isPortalAccess = true;
                this.selectedLoginIssue = '';
            } else {
                this.isLogin = false;
                this.selectedLoginIssue = '';
            }
    
            if (this.selectedTopic === 'Integration') {
                this.isIntegration = true;
            }
    
            if (this.selectedTopic === 'Documentation') {
                this.isDocumentation = true;
            }
    
            if (this.selectedTopic === 'Login' || this.selectedTopic === 'Integration' || this.selectedTopic === 'Documentation') {
                this.isRadioContainer = true;
            } else {
                this.isRadioContainer = false;
            }
    
            if (this.selectedTopic === 'Other' || this.selectedTopic === 'Session Query' || this.selectedTopic === 'Walkthrough' || this.selectedTopic === 'Envelope Status') {
                this.isHowCanWeHelp = true;
            }
    
            if (this.selectedTopic === 'Session Query') {
                this.isSessionQueryTopic = true;
                this.selectedSessionQueryTopic = '';
                this.isSessionIDInputBoxTopic = false;
                this.sessionID = '';
            } else {
                this.isSessionQueryTopic = false;
            }
        } catch (error) {
            console.error('Error in handleTopicChange:', error);
        }
    }
    

    loginIssueOptions = [
        { label: 'None', value: 'None' },
        { label: 'Changed Phones', value: 'Changed Phones' },
        { label: 'Forgot Password', value: 'Forgot Password' },
        { label: 'Not receiving password reset emails', value: 'Not receiving password reset emails' },
        { label: 'Bug', value: 'Bug' }
    
    ];

    handleLoginIssueChange(event) {
        try {
            this.resetHelpfulArticleContainerValues();
            const value = event.target.value;
            this.selectedLoginIssue = value;
    
            if (value === 'None') {
                this.isPortalAccess = true;
                this.isRadioContainer = true;
                return;
            }
    
            this.isForgotPassword = value === 'Forgot Password';
            this.isChangedPhone = value === 'Changed Phones';
            this.isPasswordReset = value === 'Not receiving password reset emails';
            this.isBug = value === 'Bug';
            
            if (this.isBug) {
                this.isRadioContainer = false;
            } else {
                this.isRadioContainer = true;
            }
        } catch (error) {
            console.error('Error in handleLoginIssueChange:', error);
        }
    }
    

    sessionQueryTopicOptions = [
        { label: 'None', value: 'None' },
        { label: 'What happened to my session', value: 'What happened to my session' },
        { label: 'Check failed', value: 'Check failed' },
        { label: 'Session aborted', value: 'Session aborted' },
        { label: 'Server Error', value: 'Server Error' },
        { label: 'Bug', value: 'Bug' }
    ];

    handleSessionQueryTopicChange(event) {
        try {
            const value = event.target.value;
            this.selectedSessionQueryTopic = value;
            if (this.selectedSessionQueryTopic == 'None' || this.selectedSessionQueryTopic == '') {
                this.isSessionIDInputBoxTopic = false;
            } else {
                this.isSessionIDInputBoxTopic = true;
                this.sessionID = '';
            }
        } catch (error) {
            console.error('Error in handleSessionQueryTopicChange:', error);
        }
    }
    
    handleDocumentationUsefulInputChange(event) {
        try {
            this.documentationUsefulValue = event.target.value;
            if (this.documentationUsefulValue === 'Yes') {
                this.isHowCanWeHelp = true;
                this.isDocumentationUseful = true;
            } else {
                this.isHowCanWeHelp = false;
                this.isDocumentationUseful = false;
            }
        } catch (error) {
            console.error('Error in handleDocumentationUsefulInputChange:', error);
        }
    }
    
    handleSubmit() {
        try {
            // if(!this.yourName || !this.email || !this.companyName){
            //     this.showAlert = true;
            //     if (!this.yourName) this.isCompanyNameInvalid=true;
            //     if (!this.email) this.isYourNameInvalid = true;
            //     if (!this.companyName) this.isEmailInvalid = true;
            // }else{
            this.showAlert = false;
            const sessionQuery = this.selectedSessionQueryTopic || this.selectedSessionQuerySupport;
            createCaseFromGetInTouchForm({
                isBusiness: this.businessEnquiryValue,
                descriptionText: this.howCanWeHelpValue,
                companyName: this.companyName,
                webEmail: this.email,
                language: this.selectedLanguage,
                loginIssue: this.selectedLoginIssue,
                name: this.name,
                productLabel: this.selectedProduct,
                queryTypeBusiness: this.selectedSupportTypeBusiness,
                queryTypeIndividual: this.selectedSupportTypeIndividual,
                valueOfTopic: this.selectedTopic,
                isFAQUseful: this.isDocumentationUseful,
                faqUseful: this.documentationUsefulValue,
                sessionQuery: sessionQuery,
                sessionID: this.sessionID,
                receiptID: this.receiptID,
                invoiceAndBilling: this.selectedInvoiceBilling
            })
            .then(result => {
                if (result) {
                    console.log('Case created with ID:', result);
                    this.isSuccess = true; // ✅ set to true if successful
                }
            })
            .catch(error => {
                console.error('Error creating case:', error);
            });
        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    }
}
// }
