import { LightningElement, track, wire } from 'lwc';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';
import DNMC from '@salesforce/messageChannel/DesktopNavigationMessageChannel__c';
import IMAGES from '@salesforce/resourceUrl/Images';

export default class SiteHeader extends LightningElement {
    logoUrl = IMAGES + '/yotilogo.png';
    closeIcon = IMAGES + '/crossIcon.png';

    @track hamburgerSearchIcon = false;

    subscription1;
    subscription2;

    @wire(MessageContext)
    messageContext;

    receivedMessage;

    @track activePage = 'home';

    get businessNavClass() {
        return this.activePage === 'business' ? 'nav-link active' : 'nav-link';
    }

    get individualsNavClass() {
        return this.activePage === 'individuals' ? 'nav-link active' : 'nav-link';
    }

    get homeNavClass() {
        return this.activePage === 'home' ? 'nav-link active' : 'nav-link';
    }

    get getInTouchNavClass() {
        return this.activePage === 'getInTouch' ? 'nav-link active' : 'nav-link';
    }

    connectedCallback() {
        try {
            this.subscription1 = subscribe(this.messageContext, HMC, (message) => {
                this.handleMessage(message);
            });

            this.subscription2 = subscribe(this.messageContext, DNMC, (message) => {
                this.handleDesktopNavigationMessage(message);
            });
        } catch (error) {
            console.error("Error during subscription:", error);
        }
    }

    handleNavClick(event) {
        try {
            const page = event.currentTarget.dataset.page;
            this.activePage = page;
        } catch (error) {
            console.error("Error handling navigation click:", error);
        }
    }

    handleDesktopNavigationMessage(message) {
        try {
            this.activePage = message.messageText;
        } catch (error) {
            console.error("Error handling desktop navigation message:", error);
        }
    }

    handleMessage(message) {
        try {
            this.receivedMessage = message.messageText;
            if (this.receivedMessage === 'Navigation Item Clicked') {
                this.hamburgerSearchIcon = false;
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    }

    toggleSearch() {
        try {
            this.hamburgerSearchIcon = true;
            publish(this.messageContext, HMC, {
                messageText: 'Search Icon Clicked'
            });
        } catch (error) {
            console.error("Error toggling search:", error);
        }
    }

    toggleMenu() {
        try {
            this.hamburgerSearchIcon = true;
            publish(this.messageContext, HMC, {
                messageText: 'Hamburger Clicked'
            });
        } catch (error) {
            console.error("Error toggling menu:", error);
        }
    }

    closeMenu() {
        try {
            this.hamburgerSearchIcon = false;
            publish(this.messageContext, HMC, {
                messageText: 'Close Clicked'
            });
        } catch (error) {
            console.error("Error closing menu:", error);
        }
    }

    handleSearch(event) {
        try {
            const searchTerm = event.detail;
            console.log('Search Term:', searchTerm);
            // Navigate to the search results page with the keyword as a query parameter
            window.location.href = '/yotiSupportSite/search-page?searchKeyword=' + encodeURIComponent(searchTerm);
        } catch (error) {
            console.error("Error handling search:", error);
        }
    }
}
