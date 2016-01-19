/**
 * Created by paul on 15.01.16.
 */
var $ = require('jQuery');
var db = require('./controller/db_controller');

var ldb = require('./controller/local_db');


$(function() {
    window.$ = window.jQuery = require('./js/jquery.min.js');
    bindCustomerForm();
    bindUpdCustomerForm();

    db.getAllCustomers(function (customers) {
        if (customers !== null) {
            table(customers);
            ldb.reload(customers);
        } else {
            ldb.getAll(function(arr) {
                table(arr);
            });
        }
    });
    
});

function bindTr() {
    $('tr').on('click',function(e) {
        if (!$(e.target).is('.del-btn')) {
            $('tr').removeClass('active-tr');
            $(this).addClass('active-tr');//текущая тр
            var thArray = $(this).children();
            thArray.each(function(i, field){
                if ($(this).data('name') === 'date') {
                    setData($(this).data('name') + 'Upd', $(this).data('timestamp'));
                } else {
                    setData($(this).data('name')+'Upd', $(this).text());
                }
            });
            $('#updCustomer').modal();
        }
    });
}



function bindCustomerForm() {
    $('#addCustomerForm').submit(function() {
        var customer = {};
        $.each($('#addCustomerForm').serializeArray(), function(i, field) {
            customer[field.name] = field.value;
        });
        customer.date = Date.now();
        db.addCustomer(customer, function(err, row) {
            if (err) {
                ldb.add(customer, function(data){});
            } else {
                console.log(row);
            }
        });
    });
}

function bindUpdCustomerForm() {
    $('#updForm').submit(function() {
        var customer = {};
        $.each($('#updForm').serializeArray(), function(i, field) {
            customer[field.name] = field.value;
        });
        db.getCustomerById(customer.id, function(row) {
            if (row === null) {
                ldb.update(customer, function(err,numRows) {});
            } else {
                db.updateCustomer(jQuery.extend(row[0], customer), function (err, res) {
                    console.log(res);
                })
            }
        });
    });
}

function table(customers) {
    //append делать минимально
    //склеить в одну строку и вставить
    var table = $('<table>');
    table.addClass('table table-striped');
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
        var row = $('<tr id="'+ customers[i].id +'">');
        row.append($('<td data-name="id">').text(customers[i].id));
        row.append($('<td data-name="name">').text(customers[i].name));
        row.append($('<td data-name="phone">').text(customers[i].phone));
        row.append($('<td data-name="device">').text(customers[i].device !== null ? customers[i].device : ''));
        row.append($('<td data-name="problem">').text(customers[i].problem));
        row.append($('<td data-name="master">').text(customers[i].master !== null ? customers[i].master : ''));
        row.append($('<td data-name="time_limit">').text(customers[i].time_limit !== null ? customers[i].time_limit : ''));
        row.append($('<td data-name="status">').text(customers[i].is_ready == true ? 'Готов' : 'Не готов'));
        row.append($('<td data-name="warranty">').text(customers[i].warranty !== null ? customers[i].warranty : ''));
        row.append($('<td data-name="date" data-timestamp="'+customers[i].date+'">').text(getStringDate(customers[i].date)));
        row.append($('<td>').html('<button class="btn btn-danger del-btn" type="button">Удалить</button>'));
        table.append(row);
    }

    $('#tableArea').append(table);
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