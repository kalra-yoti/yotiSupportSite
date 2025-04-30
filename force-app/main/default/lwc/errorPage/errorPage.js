import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/IMAGES';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';
import DNMC from '@salesforce/messageChannel/DesktopNavigationMessageChannel__c';

export default class ErrorPage extends LightningElement {
    illustration = IMAGES + '/errorPage.png';

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

    handleClick() {
        try {
            publish(this.messageContext, DNMC, {
                messageText: 'home'
            });
        } catch (error) {
            console.error('Error in handleClick:', error);
        }
    }
}
