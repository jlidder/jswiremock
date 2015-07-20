/**
 * Created by jlidder on 15-07-18.
 */

function UrlNode(data){
    this.append = function(next){
        this.next = next;
    };
    this.getData = function(){
        return this.data;
    };
    this.setData = function(data){
        this.data = data;
    }
    this.getNext = function(){
        return this.next;
    };
    this.setParams = function(params){
        var queryParameters = params.split("&");
        if(queryParameters != null){
            this.params = [];
            for(var counter = 0; counter < queryParameters.length; counter++) {
                var keyValuePair = queryParameters[counter].split("=");
                this.params[keyValuePair[0]] = keyValuePair[1];
            }
        } else{
            queryParameters = null;
        }
    };
    this.getParams = function(){
        return this.params;
    };

    //set var's for this object
    var queryParamSplit = data.split("?");
    this.params = null;
    this.data = null;
    this.next = null;
    if(queryParamSplit != null && queryParamSplit.length > 1){
        this.setData(queryParamSplit[0]);
        this.setParams(queryParamSplit[1]);
    } else{
        this.setData(data);
    }
};

exports.buildUrlStorageLinkedList = function(url){
    var receivedSplitUrl = url.split("/");
    var parentNode = null;
    var currentNode = null;
    for(var counter=0; counter < receivedSplitUrl.length; counter++){
        if(counter==0){
            if(receivedSplitUrl[counter] === ""){ //edge case when '/1/ url, then split function returns empty first element
                counter++;
            }
            parentNode = new UrlNode(receivedSplitUrl[counter]);
            currentNode = parentNode;
        } else{
            var newNode = new UrlNode(receivedSplitUrl[counter])
            currentNode.append(newNode);
            currentNode = newNode;
        }
    }
    return parentNode;
};

exports.hasMatchingStub = function(receivedUrlPartsLinkedList, stubs){
    for(var counter=0; counter < stubs.length; counter++){
        if (recursiveUrlLinkedListSearch(receivedUrlPartsLinkedList, stubs[counter].getUrl()) == true){
            return stubs[counter];
        } else{
            continue;
        }
    }
    return null;
};

function recursiveUrlLinkedListSearch(receiveUrlParts, storedUrlParts){
    //base case
    // if receiveUrlParts is empty linked list, then RETURN TRUE end is arrived
    if(receiveUrlParts == null){
        return true;
    }
    //error scenario, we return 0
    if(storedUrlParts == null && receiveUrlParts != null){
        return false;
    }
    if(storedUrlParts == null && receiveUrlParts == null){
        return true;
    }

    //recursive case
    // if first element in receiveUrlParts is equal to first node in storedUrlParts, then CONTINUE
    // else RETURN FALSE
    if(storedUrlParts.getData().match(/(\:\w+)/) != null ||
        receiveUrlParts.getData() === storedUrlParts.getData()){

        if(receiveUrlParts.getNext() == null && storedUrlParts.getNext() == null && receiveUrlParts.getParams() != null){ //check if next query params are equal
            return checkEqualQueryParams(receiveUrlParts.getParams(), storedUrlParts.getParams());
        }

        return recursiveUrlLinkedListSearch(receiveUrlParts.getNext(), storedUrlParts.getNext());
    } else{
        return false;
    }
};

function checkEqualQueryParams(receivedQueryParams, storedQueryParams){
    for(key in receivedQueryParams){
        if(storedQueryParams[key] != null){ //check if key exists in stored query params
            if(storedQueryParams[key] === receivedQueryParams[key] || receivedQueryParams[key].match(/(\:\w+)/) != null){
                return true;
            }
        } else{
            return false;
        }
    }
    return true;
}

