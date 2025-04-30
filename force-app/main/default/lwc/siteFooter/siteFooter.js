import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/IMAGES';
import ELIMAGE from '@salesforce/resourceUrl/Image_external_link';
import { subscribe, MessageContext, publish } from 'lightning/messageService'; // Import 'publish' method
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class SiteFooter extends LightningElement {
    @track isMobileNavigation = false;
    receivedMessage;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        try {
            this.subscription = subscribe(this.messageContext, HMC, (message) => {
                this.handleMessage(message);
            });
        } catch (error) {
            console.error("Error during message subscription:", error);
        }
    }

    handleMessage(message) {
        try {
            this.receivedMessage = message.messageText;
            if (this.receivedMessage === 'Hamburger Clicked' || this.receivedMessage === 'Search Icon Clicked') {
                this.isMobileNavigation = true;
            } else {
                this.isMobileNavigation = false;
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    }

    yotiLogo = IMAGES + '/yotilogo.png';
    googlePlay = IMAGES + '/googlePlay.png';
    appStore = IMAGES + '/appStore.png';
    bCorps = IMAGES + '/bCorps.png';
    soc2 = IMAGES + '/SOC2.png';
    iso9001 = IMAGES + '/ISO9001.png';
    iso27001 = IMAGES + '/ISO27001.png';
    iso27701 = IMAGES + '/ISO27701.png';
    externalLink = ELIMAGE;  // Fixed typo here

    @track individualProducts = [
        {
            name: 'Yoti app',
            link: '/category?type=Individuals&product=Yoti app'
        },
        {
            name: 'Identity Verification',
            link: '/category?type=Individuals&product=Identity Verification'
        },
        {
            name: 'Web account',
            link: '/category?type=Individuals&product=Web account'
        },
        {
            name: 'eSignatures',
            link: '/category?type=Individuals&product=eSignatures'
        },
        {
            name: 'Yoti password manager',
            link: '/category?type=Individuals&product=Yoti password manager'
        },
        {
            name: 'Other topics',
            link: '/category?type=Individuals&product=Other topics'
        }
    ];

    @track businessProducts = [
        {
            name: 'Yoti Hub',
            link: '/category?type=Business&product=Yoti Hub'
        },
        {
            name: 'Yoti Portal',
            link: '/category?type=Business&product=Yoti Portal'
        },
        {
            name: 'eSignatures',
            link: '/category?type=Business&product=eSignatures'
        },
        {
            name: 'Age verification',
            link: '/category?type=Business&product=Age verification'
        },
        {
            name: 'Other topics',
            link: '/category?type=Business&product=Other topics'
        }
    ];

    handleCategoryClick(event) {
        try {
            // Publishing a message when category is clicked
            publish(this.messageContext, HMC, { messageText: 'Category Clicked' });
        } catch (error) {
            console.error("Error during category click handling:", error);
        }
    }
}
