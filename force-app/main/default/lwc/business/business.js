import { LightningElement } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/Images';

export default class Business extends LightningElement {
    buildingImage = IMAGES + '/icon_attributes_office_building.png';
    trustImage = IMAGES + '/trust.png';
    esignImage = IMAGES + '/esign.png';
    marketingHealthImage = IMAGES + '/icon_marketing_health.png';
    //arrowRightImage = IMAGES + '/icon_direction_arrow_right.png';
    rightArrow = IMAGES + '/rightArrow.png';
    rightChevron = IMAGES + '/icon_direction_chevron_right.png';
    externalLink = IMAGES + '/icon_generic_external_Link.png';
}