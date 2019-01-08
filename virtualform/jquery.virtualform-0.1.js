(function($) {
    // keyword list
    // _action
    // _class  
    // _type
    // _name
	
    var virtaulFormSelector = "[_class='form']";

    $.addJsonField  = function(target, name, value, type) {
        if (target[name]) {
            if (!target[name].push) {
                target[name] = [target[name]];
            }
            target[name].push(value);
        } else {
            if (type == 'list') {
                 target[name] = new Array();
                 target[name].push(value);
            } else {
                 target[name] = value;
            }
        }
    }

    $.addJsonField2 = function(target, item, depth) {        
       var jsonObject = item.virtualFormElement(depth).toJsonObject();
       jQuery.addJsonField(target, item.attr("_name"), jsonObject, item.attr("_type"));
       return jsonObject;
    }
    
    $.fn.toJsonObject = function() {
        var result = {};
        $.each(this, function() {
            $.addJsonField(result, this.name, this.value, jQuery(this).attr("_type"));
        });
        return result;
    }

    $.fn.virtualFormElement = function(depth) {
        var field = jQuery("*", jQuery(this));
        var field = field.filter(function() {
            if (jQuery(this).parents(virtaulFormSelector).size() != depth) {
                return false;
            }
                
            if (jQuery(this).is("input[type='text'],input[type='hidden'],input[type='checkbox']:checked,input[type='radio']:checked,textarea,select")) {
              if (jQuery(this).is("[disabled]")) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        });
        return field;
    }

    $.fn.toJsonVirtualForm = function() {
        var result = {};
        jQuery.toJsonVirtualForm2(result, jQuery(this), 0);
        return result;
    }
        
    $.toJsonVirtualForm2 = function(target, item, depth) {        
        var form = jQuery(virtaulFormSelector, item);
        form = form.filter(function(index) {
            if (jQuery(this).parents(virtaulFormSelector).size() == depth) {
                return true;
            }
            return false;
        });    

        for (var i = 0; i < form.size(); i++) {
            var f = jQuery(form.get(i));
            var jsonObject = jQuery.addJsonField2(target, f, depth + 1);
            if(jQuery(virtaulFormSelector, f).size() > 0) {
                jQuery.toJsonVirtualForm2(jsonObject, f, depth + 1);
            }
        }
    }

    $.fn.toJsonString = function() {
    	return JSON.stringify(jQuery(this).toJsonVirtualForm(), null, 4);    	
    }
    
    $.fn.jsonSubmit = function(param) {
    	var action = jQuery(this).attr("action");
    	var json = jQuery(this).toJsonVirtualForm();
    	var jsonString = JSON.stringify(json);
    	
    	if (param) {    		
    		if (param.validator) {
    			if (!param.validator(json)) {
					return;
				}    			
    		}
    	}
    	
    	if (param.handle) {
    		jQuery.post(action, {"json": jsonString}, param.handle, "json");
    	} else {    		
    		var form = jQuery("<form id='_jsonForm' action='" + action + "' method='post'><input type='hidden' name='json'></form>").appendTo(jQuery(this));
	        jQuery(":hidden[name='json']").val(jsonString);
	        form.submit();
    	}   
    }
})(jQuery);