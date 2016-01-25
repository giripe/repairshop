/**
 * Created by paul on 15.01.16.
 */
var $ = require('jQuery');
var ldb = require('./../controller/local_db');
var db = require('./../controller/db_controller');


$(function() {
    window.$ = window.jQuery = require('./../js/jquery.min.js');
    bindAddCustomerForm();
    bindUpdCustomerForm();

    db.getAllCustomers(function (customers) {
        if (customers !== null) {
            ldb.getNoPosted(function(err, docs) {
                if (err) {
                    console.log(err.message);
                } else {
                    for (var i = 0; i < docs.length; i++) {
                        delete docs[i]._id;
                        if (docs[i].id === undefined) {
                            db.addCustomer(docs[i], function (err, ret) {});
                        } else {
                            db.updateCustomer(docs[i], function (err, ret) {});
                        }
                    }
                }
            });
            generateTable(customers);
            ldb.reload(customers);
        } else {
            ldb.getAll(function(arr) {
                generateTable(arr);
            });
        }
    });

    $('#hello').append(localStorage.name);
    addBtnClick();
});

function bindTr() {
    $('tr').on('click',function(e) {
        if (!$(e.target).is('.del-btn')) {
            //$('tr').removeClass('active-tr');
            //$(this).addClass('active-tr');
            //document.getElementById('updForm').reset();
            var thArray = $(this).children(),
                $readyCheckbox = $('#ready'),
                $notReadyCheckbox = $('#nready');

            thArray.each(function(i, field){
                switch ($(this).data('name')) {
                    case 'date':
                        setData($(this).data('name') + 'Upd', $(this).data('timestamp'));
                        break;
                    case 'is_ready':
                        //$('input:radio[name=is_ready]').attr('checked', false);
                        if ($(this).text() === 'Готово') {
                            $readyCheckbox.prop('checked', true);
                        } else {
                            $notReadyCheckbox.prop('checked', true);
                        }
                        break;
                    default:
                        setData($(this).data('name')+'Upd', $(this).text());
                        break;
                }
            });
            $('#updCustomer').modal();
        }
    });
}



function bindAddCustomerForm() {
    $('#addCustomerForm').submit(function(e) {
        clearForm();
        e.preventDefault();
        var customer = {};
        $.each($('#addCustomerForm').serializeArray(), function(i, field) {
            customer[field.name] = field.value;
        });
        customer.date = Date.now();
        customer.master = localStorage.name;
        db.addCustomer(customer, function(err, row) {
            if (err) {
                ldb.add(customer, function(data){});
            }
        });
        appendCustomer(customer);
        $('#addCustomerModal').modal('hide')
    });
}

function bindUpdCustomerForm() {
    $('#updForm').submit(function(e) {
        e.preventDefault();
        var customer = {};
        $.each($('#updForm').serializeArray(), function(i, field) {
            customer[field.name] = field.value;
        });
        db.getCustomerById(customer.id, function(row) {
            if (row === null) {
                ldb.update(customer, function(err,numRows) {});
            } else {
                db.updateCustomer(jQuery.extend(row[0], customer), function (err, res) {})
            }
        });
        updateTrData(customer);
        $('#updCustomer').modal('hide');
    });
}

function addBtnClick() {
    $('#addBtn').click(function() {
        $('#addCustomerModal').modal();
        clearForm();
    });
}

function generateTable(customers) {
    //append делать минимально
    //склеить в одну строку и вставить
    var table = $('<table>');
    table.addClass('table table-striped');
    $('#tableArea').append(table);

    var rowHead = $('<tr>');
    rowHead.append($('<th>').text('#'));
    rowHead.append($('<th>').text('Имя клиента'));
    rowHead.append($('<th>').text('Телефон'));
    rowHead.append($('<th>').text('Устройство'));
    rowHead.append($('<th>').text('Проблема'));
    rowHead.append($('<th>').text('Мастер'));
    rowHead.append($('<th>').text('Сроки'));
    rowHead.append($('<th>').text('Статус'));
    rowHead.append($('<th>').text('Гарантия'));
    rowHead.append($('<th>').text('Дата'));
    rowHead.append($('<th>').text('Управление'));
    table.append(rowHead);

    for (var i = 0; i < customers.length; i++) {
        appendCustomer(customers[i]);
    }

    bindTr();
    bindDelBtn();
}

function bindDelBtn() {
    $('.del-btn').click(function() {
        var tr = $(this).closest('tr');
        db.deleteCustomer(tr.attr('id'), function(err, result) {
            if (err) {
                var date = tr.find('td[data-timestamp]').data('timestamp');
                ldb.del(date, function(err, numRows) {});
            }
            tr.remove();
        });
    });
}


function getStringDate(timeStamp) {
    var date = new Date(timeStamp);
    return (date.getHours() + ':' + date.getMinutes() + ' ' + date.getDay() + '/' + (date.getMonth()+1) + '/' + date.getFullYear());
}

function setData(id, value) {
    if (value !== 'null')
        $('#'+id).val(value);
}

function appendCustomer(customer) {
    var table = $('table');
    var row = $('<tr id="'+ customer.id +'">');
    row.append($('<td data-name="id">').text(customer.id));
    row.append($('<td data-name="name">').text(customer.name));
    row.append($('<td data-name="phone">').text(customer.phone));
    row.append($('<td data-name="device">').text(customer.device !== null ? customer.device : ''));
    row.append($('<td data-name="problem">').text(customer.problem));
    row.append($('<td data-name="master">').text(customer.master !== null ? customer.master : ''));
    row.append($('<td data-name="time_limit">').text(customer.time_limit !== null ? customer.time_limit : ''));
    row.append($('<td data-name="is_ready">').text(customer.is_ready == true ? 'Готово' : 'Не готово'));
    row.append($('<td data-name="warranty">').text(customer.warranty !== null ? customer.warranty : ''));
    row.append($('<td data-name="date" data-timestamp="'+customer.date+'">').text(getStringDate(customer.date)));
    row.append($('<td>').html('<button class="btn btn-danger del-btn" type="button">Удалить</button>'));
    table.append(row);
}

function updateTrData(customer) {
    var tr = $("td[data-timestamp='" + customer.date + "']").closest('tr');
    var arr = tr.children();
    $(arr).each(function(i, field){
        var attr = $(this).attr('data-name');
        switch (attr) {
            case 'is_ready':
                var status = (customer[attr] === '1' ? 'Готово' : 'Не готово');
                $(this).text(status);
                break;
            case 'date':
                break;
            default:
                $(this).text(customer[attr]);
                break;
        };

    });
}

function clearForm() {
    document.getElementById('addCustomerForm').reset();
    document.getElementById('updForm').reset();
}