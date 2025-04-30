import { LightningElement } from 'lwc';

export default class SearchBar extends LightningElement {
    searchTerm = '';

    // Update searchTerm as the user types
    handleInput(event) {
        this.searchTerm = event.target.value;
    }

    // Handle 'Enter' key press
    handleKeyPress(event) {
        if (event.key === 'Enter' && this.searchTerm.trim() !== '') {
            this.handleSearch();
        }
    }

    // Dispatch the custom search event with the search term
    handleSearch() {
        try {
            // Only dispatch if the search term is not empty
            if (this.searchTerm.trim() !== '') {
                this.dispatchEvent(new CustomEvent('search', { detail: this.searchTerm }));
            }
        } catch (error) {
            // Log the error to the console
            console.error('Error occurred during search:', error);
            // You can also show an error message to the user if needed
            this.dispatchEvent(new CustomEvent('error', { detail: 'An error occurred while processing the search. Please try again.' }));
        }
    }
}
