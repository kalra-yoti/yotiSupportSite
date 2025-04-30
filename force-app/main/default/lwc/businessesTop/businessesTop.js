import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/Images';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class BusinessHeader extends LightningElement {
    buildingImage = IMAGES + '/icon_attributes_office_building.png';

    @track isMobileNavigation = false;

    receivedMessage;
    subscription;

    @wire(MessageContext)
    messageContext;

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
        // Unsubscribe from the message channel when the component is removed from the DOM
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
