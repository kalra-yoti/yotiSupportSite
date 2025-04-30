import { LightningElement, track, wire } from 'lwc';
import HEADERIMAGE from '@salesforce/resourceUrl/Image_individuals_support';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class IndividualsTop extends LightningElement {
    individualImage = HEADERIMAGE;
    @track isMobileNavigation = false;
    receivedMessage;

    @wire(MessageContext) messageContext;

    connectedCallback() {
        try {
            // Subscribe to the message channel when the component is inserted into the DOM
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
            // Toggle the mobile navigation visibility based on received message
            if (this.receivedMessage === 'Hamburger Clicked' || this.receivedMessage === 'Search Icon Clicked') {
                this.isMobileNavigation = true;
            } else {
                this.isMobileNavigation = false;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    disconnectedCallback() {
        // Cleanup the subscription when the component is destroyed
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
