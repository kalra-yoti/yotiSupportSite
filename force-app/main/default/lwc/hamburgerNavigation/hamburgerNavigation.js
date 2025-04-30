import { LightningElement, track, wire } from 'lwc';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class HamburgerNavigation extends LightningElement {

    @track isHamburgerClicked = false; // Track whether the hamburger is clicked
    receivedMessage;

    @wire(MessageContext) messageContext;

    // Subscribing to the message channel when the component is inserted into the DOM
    connectedCallback() {
        try {
            this.subscription = subscribe(this.messageContext, HMC, (message) => {
                this.handleMessage(message);
            });
        } catch (error) {
            console.error('Error subscribing to message channel:', error);
        }
    }

    // Handling the change in the header icon by publishing the message
    changeHeaderIcon() {
        try {
            publish(this.messageContext, HMC, {
                messageText: 'Navigation Item Clicked'
            });
        } catch (error) {
            console.error('Error publishing message:', error);
        }
    }

    // Handle incoming messages to update the state based on message content
    handleMessage(message) {
        try {
            this.receivedMessage = message.messageText;
            if (this.receivedMessage === 'Hamburger Clicked') {
                this.isHamburgerClicked = true;
            } else {
                this.isHamburgerClicked = false;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    // Clean up the subscription when the component is destroyed
    disconnectedCallback() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
