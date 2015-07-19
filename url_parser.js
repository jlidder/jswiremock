/**
 * Created by jlidder on 15-07-18.
 */

function url_node(data){
    this.data = data;
    this.next = null;
    this.append = function(next){
        this.next = next;
    };
    this.getData = function(){
        return data;
    };
    this.getNext = function(){
        return this.next;
    };
};

exports.build_url_storage_linked_list = function(url){
    var received_split_url = url.split("/");
    var parent_node = null;
    var current_node = null;
    for(var counter=0; counter < received_split_url.length; counter++){
        if(counter==0){
            if(received_split_url[counter] === ""){ //edge case when '/1/ url, then split function returns empty first element
                counter++;
            }
            parent_node = new url_node(received_split_url[counter]);
            current_node = parent_node;
        } else{
            var new_node = new url_node(received_split_url[counter])
            current_node.append(new_node);
            current_node = new_node;
        }
    }
    return parent_node;
};

exports.check_url_match = function(received_url_parts_linked_list, stubs){
    for(var counter=0; counter < stubs.length; counter++){
        if (recursive_url_linked_list_search(received_url_parts_linked_list, stubs[counter].getUrl()) == true){
            return true;
        } else{
            continue;
        }
    }
    return false;
};

function recursive_url_linked_list_search(receive_url_parts, stored_url_parts){
    //base case
    // if receive_url_parts is empty linked list, then RETURN TRUE end is arrived
    if(receive_url_parts == null){
        return true;
    }
    //error scenario, we return 0
    if(stored_url_parts == null && receive_url_parts != null){
        return false;
    }
    if(stored_url_parts == null && receive_url_parts == null){
        return true;
    }

    //recursive case
    // if first element in receive_url_parts is equal to first node in stored_url_parts, then CONTINUE
    // else RETURN FALSE
    if(stored_url_parts.getData().match(/(\:\w+)/) != null ||
        receive_url_parts.getData() === stored_url_parts.getData()){
        return recursive_url_linked_list_search(receive_url_parts.getNext(), stored_url_parts.getNext());
    } else{
        return false;
    }
};

