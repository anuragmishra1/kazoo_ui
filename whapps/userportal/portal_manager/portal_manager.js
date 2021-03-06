winkstart.module('userportal', 'portal_manager', {
        css: [
            'css/portal_manager.css'
        ],

        templates: {
            portal_manager: 'tmpl/portal_manager.html',
            device_line: 'tmpl/device_line.html'
        },

        subscribe: {
            'portal_manager.activate' : 'activate'
        },

        validation: [
            { name: '#vm-to-email-txt', regex: _t('portal_manager', 'vm_to_email_txt_regex') },
            { name: '#ring-number-txt', regex: _t('portal_manager', 'ring_number_txt_regex') }
        ],

        resources: {
            'portal_manager.quickcall': {
                url: '{api_url}/accounts/{account_id}/devices/{device_id}/quickcall/{number}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'portal_manager.contact_list': {
                url: '{api_url}/accounts/{account_id}/contact_list',
                contentType: 'application/json',
                verb: 'GET'
            },
            'portal_account.get': {
                url: '{api_url}/accounts/{account_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'portal_user.list': {
                url: '{api_url}/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'GET'
            },
            'portal_media.list': {
                url: '{api_url}/accounts/{account_id}/media',
                contentType: 'application/json',
                verb: 'GET'
            },
            'user_device.get': {
                url: '{api_url}/accounts/{account_id}/devices/{device_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'account_devices.status': {
                url: '{api_url}/accounts/{account_id}/devices/status',
                contentType: 'application/json',
                verb: 'GET'
            },
            'account_devices.list': {
                url: '{api_url}/accounts/{account_id}/devices',
                contentType: 'application/json',
                verb: 'GET'
            },
            'user_device.list': {
                url: '{api_url}/accounts/{account_id}/devices?filter_owner_id={user_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'user_settings.get': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'user_settings.post': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'user_vmbox.list': {
                url: '{api_url}/accounts/{account_id}/vmboxes',
                contentType: 'application/json',
                verb: 'GET'
            },
            'user_vmbox.get': {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'user_vmbox.update': {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'user_cdr.list': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}/cdrs?created_from={created_from}&created_to={created_to}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        user_cdr_range: 7,

        get_registered_devices: function(success, error) {
            winkstart.request('account_devices.status', {
                    api_url: winkstart.apps['userportal'].api_url,
                    account_id: winkstart.apps['userportal'].account_id
                },
                function(_data, status) {
                    if(typeof success === 'function') {
                        success(_data);
                    }
                },
                function(_data, status) {
                    if(typeof error === 'function') {
                        error(_data);
                    }
                }
            );
        },

        get_user_devices: function(success, error) {
            winkstart.request('user_device.list', {
                    api_url: winkstart.apps['userportal'].api_url,
                    account_id: winkstart.apps['userportal'].account_id,
                    user_id: winkstart.apps['userportal'].user_id
                },
                function(_data, status) {
                    if(typeof success === 'function') {
                        success(_data);
                    }
                },
                function(_data, status) {
                    if(typeof error === 'function') {
                        error(_data);
                    }
                }
            );
        },

        get_vmbox_by_owner: function(owner_id, success, error) {
            winkstart.request('user_vmbox.list', {
                    api_url: winkstart.apps['userportal'].api_url,
                    account_id: winkstart.apps['userportal'].account_id
                },
                function(_data, status) {
                    var list_vmbox = [];
                    $.each(_data.data, function() {
                        if(this.owner_id === owner_id) {
                            list_vmbox.push(this);
                        }
                    });
                    if(typeof success === 'function') {
                        success({ data: list_vmbox });
                    }
                },
                function(_data, status) {
                    if(typeof error === 'function') {
                        error(_data);
                    }
                }
            );
        },

        get_vmbox: function(vmbox_id, success, error) {
            winkstart.request('user_vmbox.get', {
                    api_url: winkstart.apps['userportal'].api_url,
                    account_id: winkstart.apps['userportal'].account_id,
                    vmbox_id: vmbox_id
                },
                function(_data, status) {
                    if(typeof success === 'function') {
                        success(_data);
                    }
                },
                function(_data, status) {
                    if(typeof error === 'function') {
                        error(_data);
                    }
                }
            );
        },

        update_vmbox: function(data, success, error) {
            winkstart.request('user_vmbox.update', {
                    api_url: winkstart.apps['userportal'].api_url,
                    account_id: winkstart.apps['userportal'].account_id,
                    vmbox_id: data.data.id,
                    data: data.data
                },
                function(_data, status) {
                    if(typeof success === 'function') {
                        success(_data);
                    }
                },
                function(_data, status) {
                    if(typeof error === 'function') {
                        error(_data);
                    }
                }
            );
        },

        get_settings: function(success, error) {
            winkstart.request('user_settings.get', {
                    api_url: winkstart.apps['userportal'].api_url,
                    account_id: winkstart.apps['userportal'].account_id,
                    user_id: winkstart.apps['userportal'].user_id
                },
                function(_data, status) {
                    if(typeof success === 'function') {
                        success(_data);
                    }
                },
                function(_data, status) {
                    if(typeof error === 'function') {
                        error(_data);
                    }
                }
            );
        },

        update_settings: function(data, success, error) {
            var THIS = this;

            THIS.get_settings(function(_data) {
                var normalized_data = THIS.normalize_data($.extend(true, {}, _data.data, data));

                winkstart.request('user_settings.post', {
                        api_url: winkstart.apps['userportal'].api_url,
                        account_id: winkstart.apps['userportal'].account_id,
                        user_id: winkstart.apps['userportal'].user_id,
                        data: normalized_data
                    },
                    function(_data, status) {
                        if(typeof success === 'function') {
                            success(_data);
                        }
                    },
                    function(_data, status) {
                        if(typeof error === 'function') {
                            error(_data);
                        }
                    }
                );
            });
        },

        normalize_data: function(data) {
            /* Settings Part */
            if(data.call_forward != undefined) {
                data.call_forward.keep_caller_id = true;
                data.call_forward.require_keypress = true;
            }

            if(data.call_forward.number === '') {
                delete data.call_forward.number;
            }

            return data;
        },

        activate: function(parent) {
            var THIS = this;

            THIS.render_portal_manager();
        },

        render_portal_manager: function(parent) {
            var THIS = this,
                parent = parent || $('#ws-content');

            THIS.get_settings(function(_data_settings) {
				_data_settings._t = function(param){
					return window.translate['portal_manager'][param];
				};
                var portal_manager_html = THIS.templates.portal_manager.tmpl(_data_settings);

                THIS.refresh_list_devices(portal_manager_html);

                THIS.setup_page(portal_manager_html);

                /* Settings part */
                if(!_data_settings.data.vm_to_email_enabled) {
                    $('.email-field', portal_manager_html).hide();
                }

                if(!('call_forward' in _data_settings.data) || !_data_settings.data.call_forward.enabled) {
                    $('.device-field', portal_manager_html).hide();
                }

                (parent)
                    .empty()
                    .append(portal_manager_html);

                //Hack to display columns properly
                $('.dataTables_scrollHeadInner, .dataTables_scrollHeadInner table', portal_manager_html).attr('style', 'width:100%');
            });
        },

        setup_contact_list_table: function(parent, data_devices) {
            var THIS = this,
                parent = $('.bottom_part', parent),
                data_devices = data_devices || {};

            var columns = [
                {
                    'sTitle': _t('portal_manager', 'name'),
                    'sWidth': '300px'
                },
                {
                    'sTitle': _t('portal_manager', 'internal_number'),
                    'fnRender': function(obj) {
                        var link = '-',
                            number_sent = obj.aData[obj.iDataColumn];

                        if(number_sent !== '-') {
                            link = '<a class="link-quickcall" data-number="'+number_sent+'">'+number_sent+'</a>'
                        }
                        return link;
                    },
                    'sWidth': '200px'
                },
                {
                    'sTitle': _t('portal_manager', 'external_number'),
                    'fnRender': function(obj) {
                        var link = '-',
                            number_sent = obj.aData[obj.iDataColumn];

                        if(number_sent !== '-') {
                            link = '<a class="link-quickcall" data-number="'+number_sent+'">'+number_sent+'</a>'
                        }
                        return link;
                    },
                    'sWidth': '200px'
                }
            ];

            winkstart.table.create('contact_list', $('#contact_list_grid', parent), columns, {}, {
                sDom: '<"contact_title">frtlip',
                bAutoWidth: false,
                aaSorting: [[0, 'desc']]
            });

            $(parent).delegate('.link-quickcall', 'click', function() {
                var device_id = $('#device_quickcall', parent).val(),
                    number = $(this).data('number');

                if(device_id && device_id.length === 32) {
                    winkstart.request('portal_manager.quickcall', {
                            api_url: winkstart.apps['userportal'].api_url,
                            account_id: winkstart.apps['userportal'].account_id,
                            device_id: device_id,
                            number: number
                        },
                        function(data) {
                        }
                    );
                }
                else {
                    winkstart.alert(_t('portal_manager', 'you_need_to_select_a_registered_device'));
                }
            });

            $('div.contact_title', parent).html('<div class="device-selector">' + _t('portal_manager', 'quickcall_device') + '<select class="medium" id="device_quickcall"></select><input type="text" id="manual_number" placeholder="2000"></input><button id="quickcall_btn" style="display: none;" class="btn primary">' + _t('portal_manager', 'call') + '</button></div>');

            $('#manual_number', parent).keyup(function() {
                if($(this).val() !== '') {
                    $('#quickcall_btn', parent).show();
                }
                else {
                    $('#quickcall_btn', parent).hide();
                }
            });

            $('#quickcall_btn', parent).click(function() {
                var device_id = $('#device_quickcall', parent).val(),
                    number = $('#manual_number', parent).val();

                if(device_id && device_id.length === 32) {
                    winkstart.request('portal_manager.quickcall', {
                            api_url: winkstart.apps['userportal'].api_url,
                            account_id: winkstart.apps['userportal'].account_id,
                            device_id: device_id,
                            number: number
                        },
                        function(data) {
                        }
                    );
                }
                else {
                    winkstart.alert(_t('portal_manager', 'you_need_to_select_a_registered_device'));
                }
            });

            $('.cancel-search', parent).click(function(){
                $('#contact_list-grid_filter input[type=text]', parent).val('');
                winkstart.table.contact_list.fnFilter('');
            });

            winkstart.request(true, 'portal_manager.contact_list', {
                    account_id: winkstart.apps['userportal'].account_id,
                    api_url: winkstart.apps['userportal'].api_url
                },
                function(_data, status) {
                    if(_data.data) {

                        $.fn.dataTableExt.afnFiltering.pop();

                        var tab_data = [];

                        $.each(_data.data, function(k, v) {
                            tab_data.push([
                                v.name,
                                v.internal_number ? v.internal_number : '-',
                                v.external_number ? v.external_number : '-'
                            ]);
                        });

                        winkstart.table.contact_list.fnAddData(tab_data);
                    }
                }
            );
        },

        setup_page: function(parent) {
            var THIS = this,
                portal_manager_html = parent;

            /* Settings Part */
            $('#ring-number-txt', portal_manager_html).keyup(function() {
                if($(this).val() === '') {
                    $('.device-field', portal_manager_html).slideUp();
                    $('#ring-device-checkbox', portal_manager_html).removeAttr('checked');
                } else {
                    $('.device-field', portal_manager_html).slideDown();
                    $('#ring-device-checkbox', portal_manager_html).attr('checked', 'checked');
                }
            });

            $('#vm-to-email-checkbox', portal_manager_html).change(function() {
                $('#vm-to-email-checkbox', portal_manager_html).attr('checked') ? $('.email-field', portal_manager_html).slideDown() : $('.email-field', portal_manager_html).slideUp();
            });

            $('#contact_list_btn', portal_manager_html).click(function(e) {
                e.preventDefault();

                THIS.popup_contact_list();
            });

            $('#save-settings-link', portal_manager_html).click(function(e) {
                e.preventDefault();

                var replaced_number = $('#ring-number-txt', portal_manager_html).val();

                if(replaced_number.match(/^[\+]?[0-9\s\-\.\(\)]{7,20}$/)) {
                    replaced_number = replaced_number.replace(/\s|\(|\)|\-|\./g,'');
                }

                var data = {
                    vm_to_email_enabled: false,
                    call_forward: {
                        number: replaced_number,
                        enabled: replaced_number !== '' ? true : false,
                        substitute: $('#ring-device-checkbox', portal_manager_html).attr('checked') ? false : true
                        //Substitute equals true to enable real call forwarding, false in order to ring devices as well.
                    }
                };

                if($('#vm-to-email-checkbox', portal_manager_html).attr('checked')) {
                    data.vm_to_email_enabled = true;
                    data.email = $('#vm-to-email-txt', portal_manager_html).val();
                }

                THIS.update_settings(data, function() {
                    THIS.render_portal_manager();
                });
            });

            /* Voicemails part */
            THIS.setup_voicemail_table(parent);

            /*CDRs Part*/
            THIS.setup_cdr_table(parent);

            /* Contact List Part */
            THIS.setup_contact_list_table(parent);
        },

        refresh_list_devices: function(parent) {
            var THIS = this,
                portal_manager_html = parent,
                friendly_types = {
                    'cellphone': 'Cell',
                    'smartphone': 'Smartphone',
                    'fax': 'Fax',
                    'sip_device': 'VoIP',
                    'softphone': 'Softphone',
                    'landline': 'Landline'
                };

            THIS.get_registered_devices(function(_data_registered) {
                THIS.get_user_devices(function(_data_devices) {
                    $('.list_devices', portal_manager_html).html('<div class="clear"/>');
                    $('#device_quickcall', portal_manager_html).empty();

                    var data_device,
                        registered_data = {};

                    $.each(_data_registered.data, function(k, v) {
                        registered_data[v.device_id] = true;
                    });

                    $.each(_data_devices.data, function(k, v) {
                        v.registered = v.id in registered_data || $.inArray(v.device_type, ['cellphone', 'smartphone', 'landline']) > -1 ? 'registered' : 'unregistered';
                        data_device = {
                            status: v.registered,
                            name: v.name,
                            device_type: v.device_type,
                            friendly_type: friendly_types[v.device_type],
                            id: v.id
                        };

                        if(v.registered === 'registered') {
                            $('#device_quickcall', portal_manager_html).append('<option value="'+v.id+'">'+v.name+'</option>');
                        }
                        $('.list_devices', portal_manager_html).prepend(THIS.templates.device_line.tmpl(data_device));
                    });
                });
            });
        },

        setup_cdr_table: function(parent) {
            var user_cdr_html = parent,
                THIS = this,
                range = THIS.user_cdr_range,
                columns = [
                {
                    'sTitle': _t('portal_manager', 'date'),
                    'sWidth': '250px'
                },

                {
                    'sTitle': _t('portal_manager', 'from_caller_id'),
                    'sWidth': '350px'
                },
                {
                    'sTitle': _t('portal_manager', 'to_dialed_number'),
                    'sWidth': '350px'
                },
                {
                    'sTitle': _t('portal_manager', 'duration'),
                    'sWidth': '160px'
                },
                {
                    'sTitle': 'billing_seconds',
                    'bVisible': false
                }
            ];

            winkstart.table.create('user_cdr', $('#user_cdr-grid', user_cdr_html), columns, {}, {
                sDom: '<"date">frtlip',
                sScrollY: '150px',
                aaSorting: [[0, 'desc']]
            });

            $.fn.dataTableExt.afnFiltering.pop();

            $('div.date', user_cdr_html).html(_t('portal_manager', 'start_date') + ': <input id="startDate" readonly="readonly" type="text"/>&nbsp;&nbsp;' + _t('portal_manager', 'end_date') + ': <input id="endDate" readonly="readonly" type="text"/>&nbsp;&nbsp;&nbsp;&nbsp;<button class="button-search btn primary" id="searchLink" href="javascript:void(0);">' + _t('portal_manager', 'filter') + '</button><label class="call_duration"/>');

            var $call_duration = $('#user_cdr-grid_wrapper .call_duration', user_cdr_html);
            $('#user_cdr-grid_wrapper #user_cdr-grid_filter input[type=text]', user_cdr_html).keyup(function() {
                $(this).val !== '' ? $call_duration.hide() : $call_duration.show();
            });

            $('#searchLink', user_cdr_html).click(function() {
                var start_date = $('#startDate', user_cdr_html).val(),
                    end_date = $('#endDate', user_cdr_html).val(),
                    /* I18N - to be fixed for national date formats */
                    regex = /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d$/;

                winkstart.table.user_cdr.fnClearTable();
                $('#user_cdr-grid_wrapper .call_duration', user_cdr_html).text('');

                if(start_date.match(regex) && end_date.match(regex)) {
                    var start_date_sec = (new Date(start_date).getTime()/1000) + 62167219200,
                        end_date_sec = (new Date(end_date).getTime()/1000) + 62167219200;

                    if((end_date_sec - start_date_sec) <= (range*24*60*60)) {
                        THIS.list_by_date(start_date_sec, end_date_sec);
                    }
                    else {
                        winkstart.alert(_t('portal_manager', 'the_range_is_bigger_than') + range + _t('portal_manager', 'days_please_correct_it'));
                    }
                }
                else {
                    winkstart.alert(_t('portal_manager', 'dates_in_the_filter'));
                }
            });

            THIS.init_datepicker(user_cdr_html);

            var tomorrow = new Date(THIS.to_string_date(new Date()));
            tomorrow.setDate(tomorrow.getDate() + 1);

            var end_date = Math.floor(tomorrow.getTime()/1000) + 62167219200,
                start_date = end_date - (range*24*60*60);

            THIS.list_by_date(start_date, end_date);
        },

        init_datepicker: function(parent) {
            var THIS = this,
                user_cdr_html = parent,
                $start_date = $('#startDate', user_cdr_html),
                $end_date = $('#endDate', user_cdr_html),
                start_date = new Date(),
                end_date,
                tomorrow = new Date(),
                range = THIS.user_cdr_range;

            tomorrow.setDate(tomorrow.getDate() + 1);

            $('#startDate, #endDate', user_cdr_html).datepicker(
                {
                    beforeShow: customRange,
                    onSelect: customSelect
                }
            );

            end_date = tomorrow;
            start_date.setDate(new Date().getDate() - range + 1);

            $start_date.datepicker('setDate', start_date);
            $end_date.datepicker('setDate', end_date);

            function customSelect(dateText, input) {
                var date_min,
                    date_max;

                if(input.id == 'startDate') {
                    date_min = $start_date.datepicker('getDate');
                    if($end_date.datepicker('getDate') == null) {
                        date_max = date_min;
                        date_max.setDate(date_min.getDate() + range);
                        $end_date.val(THIS.to_string_date(date_max));
                    }
                    else {
                        date_max = $end_date.datepicker('getDate');
                        if((date_max > (new Date(date_min).setDate(date_min.getDate() + range)) || (date_max <= date_min))) {
                            date_max = date_min;
                            date_max.setDate(date_max.getDate() + range);
                            date_max > tomorrow ? date_max = tomorrow : true;
                            $end_date.val(THIS.to_string_date(date_max));
                        }
                    }
                }
                else if(input.id == 'endDate') {
                    if($start_date.datepicker('getDate') == null) {
                        date_min = $end_date.datepicker('getDate');
                        date_min.setDate(date_min.getDate() - 1);
                        $start_date.val(THIS.to_string_date(date_min));
                    }
                }
            };

            function customRange(input) {
                var date_min = new Date(2011, 0, 0),
                    date_max,
                    range = THIS.user_cdr_range;

                if (input.id == 'endDate')
                {
                    date_max = tomorrow;
                    if ($start_date.datepicker('getDate') != null)
                    {
                        date_min = $start_date.datepicker('getDate');
                        /* Range of 1 day minimum */
                        date_min.setDate(date_min.getDate() + 1);
                        date_max = $start_date.datepicker('getDate');
                        date_max.setDate(date_max.getDate() + range);

                        if(date_max > tomorrow) {
                            date_max = tomorrow;
                        }
                    }
                }
                else if (input.id == 'startDate') {
                    date_max = new Date();
                }

                return {
                    minDate: date_min,
                    maxDate: date_max
                };
            }
        },

        to_string_date: function(date) {
           var day = date.getDate(),
                    month = date.getMonth()+1,
                    year = date.getFullYear();

            day < 10 ? day = '0' + day : true;
            month < 10 ? month = '0' + month : true;

            return month+'/'+day+'/'+year;
        },

        friendly_date: function(timestamp) {
            var parsed_date = '-';

            if(timestamp) {
                var today = new Date(),
                    today_year = today.getFullYear(),
                    today_month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1,
                    today_day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate(),
                    date = new Date((timestamp - 62167219200)*1000),
                    month = date.getMonth() +1,
                    year = date.getFullYear(),
                    day = date.getDate(),
                    hours = date.getHours(),
                    minutes = date.getMinutes();

				if(hours >= 12) {
					if(hours !== 12) {
						hours -= 12;
					}

					suffix = 'pm';
				}
				else {
					if(hours === 0) {
						hours = 12;
					}

					suffix = 'am';
				}

                day = day < 10 ? '0' + day : day;
                month = month < 10 ? '0' + month : month;
                hours = hours < 10 ? '0'+ hours : hours;
                minutes = minutes < 10 ? '0'+ minutes : minutes;

                var humanDate = year != new Date().getFullYear() ? month+'/'+day+'/'+year : month+'/'+day,
                    humanTime = hours + ':' + minutes + suffix;

                if(today_year === year && today_month === month && today_day === day) {
                    humanDate = 'Today';
                }

                parsed_date = humanDate + ' ' + humanTime;
            }

            return parsed_date;
        },

        list_by_date: function(start_date, end_date) {
            var THIS = this,
                parse_duration = function(duration, type) {
                    var duration = parseFloat(duration);
                        seconds = duration % 60,
                        minutes = ((duration - seconds) / 60) % 60,
                        hours = Math.floor((duration-seconds)/3600),
                        type = type || 'numbers';

                    if(hours < 10 && type == 'numbers') {
                        hours = '0' + hours;
                    }
                    if(minutes < 10) {
                        minutes = '0' + minutes;
                    }
                    if(seconds < 10) {
                        seconds = '0' + seconds;
                    }

                    if(type == 'verbose') {
                        duration = hours+' hours '+minutes+' minutes and '+seconds+' seconds';
                    }
                    else {
                        duration = hours != '00' ? hours+':'+minutes+':'+seconds : minutes+':'+seconds;
                    }

                    return duration;
                };

            winkstart.request('user_cdr.list', {
                    account_id: winkstart.apps['userportal'].account_id,
                    api_url: winkstart.apps['userportal'].api_url,
                    user_id: winkstart.apps['userportal'].user_id,
                    created_from: start_date,
                    created_to: end_date
                },
                function(_data, status) {
                    var duration,
                        humanFullDate,
                        call_duration = 0;

                    var tab_data = [];

                    $.each(_data.data, function() {
                        if(this.duration_seconds > 0) {
                            duration = this.duration_seconds >= 0 ? parse_duration(this.duration_seconds) : '--';
                            humanFullDate = THIS.friendly_date(this.timestamp);
                            call_duration += this.duration_seconds >= 0 ? parseFloat(this.duration_seconds) : 0;

                            tab_data.push([
                                humanFullDate,
                                this.caller_id_number === this.caller_id_name ? this.caller_id_number || '(empty)' : this.caller_id_number + ' (' + this.caller_id_name+')',
                                this.callee_id_number === this.callee_id_name ? this.callee_id_number || this.to.substring(0, this.to.indexOf('@') != -1 ? this.to.indexOf('@') : this.to.length) || '(empty)' : this.callee_id_number + ' (' + this.callee_id_name+')',
                                duration || '-',
                                this.duration_seconds
                            ]);
                        }
                    });

                    call_duration = 'Total duration : ' + parse_duration(call_duration, 'verbose');

                    winkstart.table.user_cdr.fnAddData(tab_data);

                    $('.dataTables_scrollHeadInner, .dataTables_scrollHeadInner table').attr('style', 'width:100%');
                }
            );
        },

        setup_voicemail_table: function(parent) {
            var THIS = this,
                columns = [
                    {
                      'sTitle': '<input type="checkbox" id="select_all_voicemails"/>',
                      'sWidth': '40px',
                      'bSortable': false,
                      'fnRender': function(obj) {
                          var msg_uri = obj.aData[obj.iDataColumn];
                          return '<input type="checkbox" class="select-checkbox" msg_uri="'+ msg_uri  +'"/>';
                      }
                    },
                    {
                      'sTitle': _t('portal_manager', 'message_index'),
                      'bSearchable': false,
                      'bVisible': false
                    },
                    {
                      'sTitle': _t('portal_manager', 'voicemail_box_id'),
                      'bSearchable': false,
                      'bVisible': false
                    },
                    { 'sTitle': _t('portal_manager', 'date'),
                      'sWidth': '220px'
                    },
                    {
                      'sTitle': _t('portal_manager', 'caller_id'),
                      'sWidth': '150px'
                    },
                    { 'sTitle': _t('portal_manager', 'status'),
                      'sWidth': '130px'
                    },
                    {
                      'sTitle': _t('portal_manager', 'listen'),
                      'bSortable': false,
                      'sWidth': '200px',
                      'fnRender': function(obj) {
                          var msg_uri = obj.aData[obj.iDataColumn];
                          return '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="105" height="19">' +
                                 '<param name="quality" value="high" />' +
                                 '<param name="wmode" value="transparent">' +
                                 '<param name="menu" value="false" />' +
                                 '<embed src="whapps/userportal/portal_manager/assets/flash/xspf_player.swf?' +
                                 'player_mode=mini&skin_mode=on&song_url=' + THIS.voicemail_uri(msg_uri) +
                                 '&song_title=VM&autoload=1&bg_color=595959&txt_color=BCB5AB&button_color=BCB5AB"type="application/x-shockwave-flash" width="105" height="17"></embed>' +
                                 '</object><a style="position:relative; top: -10px;" href="' + THIS.voicemail_uri(msg_uri)  + '"><span class="icon medium download" alt="Download"/></a>';
                      }
                    }
                ];

            winkstart.table.create('voicemail', $('#voicemail-grid', parent), columns, {}, {
                sDom: '<"actions_voicemail">frtlip',
                sScrollY: '150px',
                aaSorting: [[3, 'desc']]
            });

            $.fn.dataTableExt.afnFiltering.pop();

            $('div.actions_voicemail', parent).html('<button id="new-voicemail-link" class="btn primary" data-action="new">' + _t('portal_manager', 'mark_as_new') + '</button><button id="save-voicemail-link" class="btn success" data-action="saved">' + _t('portal_manager', 'mark_as_saved') + '</button><button id="delete-voicemail-link" class="btn danger" data-action="deleted">' + _t('portal_manager', 'delete') + '</button>');

            $('#save-voicemail-link, #delete-voicemail-link, #new-voicemail-link', parent).click(function(e) {
                e.preventDefault();

                var vmboxes, action = $(this).dataset('action');
                if($('.select-checkbox:checked', parent).size()) {
                    var change_status = function() {
                        vmboxes = {};
                        $('.select-checkbox:checked', parent).each(function() {
                            var row = $(this).parents('tr')[0],
                                vmbox_id = winkstart.table.voicemail.fnGetData(row, 2);

                            vmboxes[vmbox_id] ? vmboxes[vmbox_id].push(row) : vmboxes[vmbox_id] = [row];
                        });

                        $.each(vmboxes, function(key, rows) {
                            THIS.get_vmbox(key, function(reply) {
                                var msg_index;

                                if(reply.data.messages == undefined) {
                                    return false;
                                }

                                $.each(rows, function(i, row) {
                                    msg_index = winkstart.table.voicemail.fnGetData(row, 1);

                                    if($.inArray(action, ['saved', 'deleted', 'new']) > -1) {
                                        reply.data.messages[msg_index].folder = action;
                                    }
                                });

                                THIS.update_vmbox(reply, function() {
                                    //TODO Redraw
                                    $.each(rows, function(i, row) {
                                        if($.inArray(action, ['saved', 'new']) > -1) {
                                            winkstart.table.voicemail.fnUpdate(action, row, 5);
                                        }
                                        else if(action == 'deleted') {
                                            winkstart.table.voicemail.fnDeleteRow(row);
                                        }
                                    });

                                    $('.select-checkbox, #select_all_voicemails', parent).prop('checked', false);
                                });
                            });
                        });
                    };

                    if(action === 'delete') {
                        winkstart.confirm(_t('portal_manager', 'are_you_sure_that_you_want_to_delete'), function() {
                            change_status();
                        });
                    }
                    else {
                        change_status();
                    }
                }
            });

            $('#select_all_voicemails', parent).change(function() {
                $('.select-checkbox', parent).prop('checked', $(this).is(':checked'));
            });

            THIS.get_vmbox_by_owner(winkstart.apps['userportal'].user_id, function(_data_list) {
                if(_data_list.data.length > 0) {
                    var vmbox_id = _data_list.data[0].id;
                    THIS.get_vmbox(vmbox_id, function(_data_vmbox) {
                        if(_data_vmbox.data.messages) {
                            var tab_messages = [];

                            $.each(_data_vmbox.data.messages, function(index, msg) {
                                if(this.folder != 'deleted') {
                                    var msg_id = msg.media_id,
                                        msg_uri = vmbox_id + '/messages/' + msg_id,
                                        date = new Date((msg.timestamp - 62167219200)*1000),
                                        month = date.getMonth() +1,
                                        year = (date.getFullYear())%100,
                                        day = date.getDate(),
                                        humanDate = month+'/'+day+'/'+year,
                                        humanTime = date.toLocaleTimeString(),
                                        humanFullDate = humanDate + ' ' + humanTime;

                                    humanFullDate = THIS.friendly_date(msg.timestamp);

                                    tab_messages.push(['0', index, vmbox_id, humanFullDate, msg.caller_id_number, msg.folder, msg_uri]);
                                }
                            });

                            winkstart.table.voicemail.fnAddData(tab_messages);

                            $('.dataTables_scrollHeadInner, .dataTables_scrollHeadInner table', parent).attr('style', 'width:100%');
                        }
                    });
                }
            });
        },

        voicemail_uri: function(msg_uri) {
            return winkstart.apps['userportal'].api_url + '/accounts/' +
                   winkstart.apps['userportal'].account_id + '/vmboxes/' +
                   msg_uri + '/raw?auth_token=' + winkstart.apps['userportal'].auth_token + '&folder=saved';
        }
    }
);
