import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';
import { NavigationMixin } from 'lightning/navigation';

export default class MobileSearchBar extends NavigationMixin(LightningElement) {

    searchTerm = '';
    receivedMessage;
    @track isSearchIconClicked = false;
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
            // Toggle the search icon visibility based on received message
            if (this.receivedMessage === 'Search Icon Clicked') {
                this.isSearchIconClicked = true;
            } else {
                this.isSearchIconClicked = false;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    handleInput(event) {
        this.searchTerm = event.target.value;
    }

    handleSearch(event) {
        // Use NavigationMixin to navigate to the search page
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/yotiSupportSite/search-page?searchKeyword=' + encodeURIComponent(this.searchTerm)
            }
        });
    }

    disconnectedCallback() {
        // Cleanup the subscription when the component is destroyed
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
