import { LightningElement } from 'lwc';
import righticon from '@salesforce/resourceUrl/rightIcon';

export default class Category extends LightningElement {


    rightIconT =  righticon;


    topicLink = [{'id':1,'name':'Topic link'},{'id':2,'name':'Topic link'},{'id':3,'name':'Topic link'},{'id':4,'name':'Topic link'}];
    titleLink =[{'id':1,'name':'This is the title of an article'},{'id':2,'name':'This is the title of an article'},{'id':3,'name':'This is the title of an article'},{'id':4,'name':'This is the title of an article'}];
    topicList = [{'id':1,'name':'Topic'},{'id':2,'name':'Topic'},{'id':3,'name':'Topic'},{'id':4,'name':'Topic'}];
}