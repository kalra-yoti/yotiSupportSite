import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/Images';
import WEBACCOUNTIMAGE from '@salesforce/resourceUrl/Image_web_account';
import PASSMANAGERIMAGE from '@salesforce/resourceUrl/Image_password_manager';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class IndividualN extends LightningElement {
    buildingImage = IMAGES + '/icon_attributes_office_building.png';
    trustImage = IMAGES + '/trust.png';
    esignImage = IMAGES + '/esign.png';
    marketingHealthImage = IMAGES + '/icon_marketing_health.png';
    iconPasswordManager = IMAGES + '/iconPasswordManager.png';
    rightArrow = IMAGES + '/rightArrow.png';
    rightChevron = IMAGES + '/icon_direction_chevron_right.png';
    webAccountImage = WEBACCOUNTIMAGE;
    iconPasswordManagerImage = PASSMANAGERIMAGE;

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
            console.error('Error subscribing to message channel:', error);
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
            console.error('Error handling message:', error);
        }
    }

    products = [
        {
            name: 'Yoti app',
            image: this.trustImage,
            description: 'Master the ins-and-outs of your digital identity app',
            link: '/category?type=Individuals&product=Yoti app'
        },
        {
            name: 'Identity Verification',
            image: this.webAccountImage,
            description: 'Learn how to confirm and share your Right to Work, rent or criminal record checks',
            link: '/category?type=Individuals&product=Identity Verification'
        },
        {
            name: 'Web account',
            image: this.webAccountImage,
            description: 'Find out how to connect your Yoti app and your Yoti web account',
            link: '/category?type=Individuals&product=Web account'
        },
        {
            name: 'eSignatures',
            image: this.esignImage,
            description: 'Get your documents signed in seconds with simple, flexible e-signatures',
            link: '/category?type=Individuals&product=eSignatures'
        },
        {
            name: 'Yoti password manager',
            image: this.iconPasswordManagerImage,
            description: 'Find all the answers you need to securely store and manage your passwords',
            link: '/category?type=Individuals&product=Yoti password manager'
        }
    ];

    supportTopics = [
        {
            title: 'Confirming your identity',
            items: [
                { name: 'Using Yoti online', link: '/category?type=Business&product=Onboarding', icon: this.rightChevron },
                { name: 'ID documents', link: '#', icon: this.rightChevron }
            ]
        },
        {
            title: 'About Yoti',
            items: [
                { name: 'Security and privacy', link: '#', icon: this.rightChevron },
                { name: 'Technical terms', link: '#', icon: this.rightChevron }
            ]
        }
    ];
}
