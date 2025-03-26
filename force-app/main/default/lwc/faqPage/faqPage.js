import { LightningElement } from 'lwc';

import righticon from '@salesforce/resourceUrl/rightIcon';
import IMAGES from '@salesforce/resourceUrl/Images';


export default class FaqPage extends LightningElement {

    faqBody = '<p> </p><p style="margin-top: 0pt;margin-bottom: 0pt;"><span style="font-size: 10pt;font-family: Verdana, sans-serif;color: #333333;background-color: #ffffff;">On the last step of sending out an envelope you can select the frequency of the reminders being sent out (everyday, every 2 days, every 7 days, or no reminders ).</span></p><p style="margin-top: 0pt;margin-bottom: 0pt;"><span style="font-size: 10pt;font-family: Verdana, sans-serif;color: #333333;background-color: #ffffff;">A max of 3 emails will be sent. The reminders will go out to recipients in the next singing group that have not signed, as long as the recipient has not completed it. If a signer has completed they will not receive any reminder emails left to go out.</span></p><p> </p><p style="margin-top: 0pt;margin-bottom: 0pt;"><img src="https://yoti--developer3.sandbox.file.force.com/servlet/rtaImage?eid=ka0Pt0000009Byj&amp;feoid=00N4L0000076dSK&amp;refid=0EMPt000000JLiH" alt="rta"></img></p><p> </p><p style="margin-top: 0pt;margin-bottom: 0pt;"><span style="font-size: 10pt;font-family: Verdana, sans-serif;color: #333333;background-color: #ffffff;">Please note that reminders are only sent to the signee(s) and not to witnesses.</span></p>'
    rightIconT =  righticon;
    businessSupport = IMAGES + '/businessSupport.png';


    renderedCallback() {
        console.log('renderedCallback');
        const richTextContainer = this.template.querySelector('.flexcontainer');
        
        if (richTextContainer && this.faqBody) {
            // Insert the rich text data as innerHTML
            richTextContainer.innerHTML = this.faqBody;
            const spans = richTextContainer.querySelectorAll('span');
            spans.forEach(span => {
                span.style.fontFamily = 'inherit';  // Inherit font family from outer container
                span.style.fontSize = '18px';
                span.style.color = '#546072';    // Inherit font size from outer container
            });
        }
    }
}