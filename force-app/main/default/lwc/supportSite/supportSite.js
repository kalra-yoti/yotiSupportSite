import { LightningElement, track, wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/IMAGES';
import { subscribe, publish, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';
import DNMC from '@salesforce/messageChannel/DesktopNavigationMessageChannel__c';

export default class SupportSite extends LightningElement {
    imageHome = IMAGES + '/imageHome.png';
    businessSupport = IMAGES + '/businessSupport.png';
    individualSupport = IMAGES + '/individualSupport.png';
    rightArrow = IMAGES + '/rightArrow.png';

    @track searchTerm = '';
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
            console.error('Error subscribing to HamburgerMessageChannel:', error);
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

    handleCategoryClick(event) {
        try {
            const category = event.currentTarget.dataset.category;
            publish(this.messageContext, DNMC, {
                messageText: category
            });
        } catch (error) {
            console.error('Error handling category click:', error);
        }
    }

    handleKeyPress(event) {
        try {
            if (event.key === 'Enter') {
                this.handleSearch(event);
            }
        } catch (error) {
            console.error('Error handling key press:', error);
        }
    }

    handleSearch(event) {
        try {
            this.searchTerm = event.target.value;
            console.log('Search term:', this.searchTerm);
            // Navigate to the search results page with the keyword as a query parameter
            window.location.href = '/yotiSupportSite/search-page?searchKeyword=' + encodeURIComponent(this.searchTerm);
        } catch (error) {
            console.error('Error handling search:', error);
        }
    }
}
