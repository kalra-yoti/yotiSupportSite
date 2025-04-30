import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/IMAGES';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class FooterNavigation extends LightningElement {
    facebook = IMAGES + '/Facebook.png';
    twitter = IMAGES + '/TwitterX.png';
    linkedin = IMAGES + '/Linkedin.png';
    youtube = IMAGES + '/Youtube.png';
    instagram = IMAGES + '/Instagram.png';

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

    navLinks = [
        { id: 1, label: 'Privacy', url: 'https://www.yoti.com/privacy/' },
        { id: 2, label: 'Terms and Conditions', url: 'https://www.yoti.com/terms/' },
        { id: 3, label: 'Cookies Settings', url: 'https://www.yoti.com/terms/' },
        { id: 4, label: 'Cookies Notice', url: 'https://www.yoti.com/privacy/cookies/' },
        { id: 5, label: 'Modern Slavery Statement', url: 'https://www.yoti.com/modern-slavery-statement/' }
    ];
}
