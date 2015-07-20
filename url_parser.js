/**
 * Created by jlidder on 15-07-18.
 */

function url_node(data){
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
        var query_parameters = params.split("&");
        if(query_parameters != null){
            this.params = [];
            for(var counter = 0; counter < query_parameters.length; counter++) {
                var key_val_pair = query_parameters[counter].split("=");
                this.params[key_val_pair[0]] = key_val_pair[1];
            }
        } else{
            query_parameters = null;
        }
    };
    this.getParams = function(){
        return this.params;
    };

    //set var's for this object
    var query_param_split = data.split("?");
    this.params = null;
    this.data = null;
    this.next = null;
    if(query_param_split != null && query_param_split.length > 1){
        this.setData(query_param_split[0]);
        this.setParams(query_param_split[1]);
    } else{
        this.setData(data);
    }
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

exports.has_matching_stub = function(received_url_parts_linked_list, stubs){
    for(var counter=0; counter < stubs.length; counter++){
        if (recursive_url_linked_list_search(received_url_parts_linked_list, stubs[counter].getUrl()) == true){
            return stubs[counter];
        } else{
            continue;
        }
    }
    return null;
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

        if(receive_url_parts.getNext() == null && stored_url_parts.getNext() == null && receive_url_parts.getParams() != null){ //check if next query params are equal
            return check_equal_query_params(receive_url_parts.getParams(), stored_url_parts.getParams());
        }

        return recursive_url_linked_list_search(receive_url_parts.getNext(), stored_url_parts.getNext());
    } else{
        return false;
    }
};

function check_equal_query_params(received_query_params, stored_query_params){
    for(key in received_query_params){
        if(stored_query_params[key] != null){ //check if key exists in stored query params
            if(stored_query_params[key] === received_query_params[key] || received_query_params[key].match(/(\:\w+)/) != null){
                return true;
            }
        } else{
            return false;
        }
    }
    return true;
}

