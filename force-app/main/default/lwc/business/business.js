import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/Images';
import ELIMAGE from '@salesforce/resourceUrl/Image_external_link';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class BusinessN extends LightningElement {
    @track buildingImage = IMAGES + '/icon_attributes_office_building.png';
    @track trustImage = IMAGES + '/trust.png';
    @track esignImage = IMAGES + '/esign.png';
    @track rightArrow = IMAGES + '/rightArrow.png';
    ageVerification = IMAGES + '/ageVerification.png';
    @track rightChevron = IMAGES + '/icon_direction_chevron_right.png';
    @track externalLink = ELIMAGE;

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
            console.error('Error in connectedCallback:', error);
        }
    }

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

    products = [
        {
            name: 'Yoti Hub',
            image: this.trustImage,
            description: 'Create and manage your Yoti integration quickly and efficiently',
            link: '/category?type=Business&product=Yoti Hub'
        },
        {
            name: 'Yoti Portal',
            image: this.trustImage,
            description: "View, create and send identity sessions to verify individual's details",
            link: '/category?type=Business&product=Yoti Identity Verification Portal'
        },
        {
            name: 'eSignatures',
            image: this.esignImage,
            description: 'Get legally binding documents signed, witnessed, and checked in seconds',
            link: '/category?type=Business&product=eSignatures'
        },
        {
            name: 'Age verification',
            image: this.ageVerification,
            description: 'Highly effective age verification, so you know your users and the right age, and nothing else.',
            link: '/category?type=Business&product=ageVerification'
        }
    ];

    supportTopics = [
        {
            title: 'Your organisation',
            items: [
                { name: 'Onboarding', link: '/category?type=Business&product=Onboarding', icon: this.rightChevron },
                { name: 'Pricing', link: '#', icon: this.rightChevron },
                { name: 'General questions', link: '#', icon: this.rightChevron }
            ]
        },
        {
            title: 'About Yoti',
            items: [
                { name: 'Security and privacy', link: '#', icon: this.rightChevron },
                { name: 'Social purpose', link: '#', icon: this.rightChevron }
            ]
        },
        {
            title: 'Supporting materials',
            items: [
                { name: "Developer’s documentation", link: '#', icon: this.externalLink }
            ]
        }
    ];

    handleSupportTopics(event) {
        try {
            let topic = event.currentTarget.dataset.link;
            if (topic) {
                window.location.href = topic;
            }
        } catch (error) {
            console.error('Error in handleSupportTopics:', error);
        }
    }
}
