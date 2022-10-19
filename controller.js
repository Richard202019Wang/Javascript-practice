function constraints1(){
    var username_con = $("#username").val();
    var letter = /^[A-Za-z0-9_]+$/;
    if (username_con.match(letter) && username_con.length > 5){
        document.getElementById('username_notification').innerHTML = " ";
        $("#username").css('background-color', "white");
    }else{
        document.getElementById('username_notification').innerHTML = 'Username is invalid';
        $("#username").css('background-color', "red");
    }
}
function constraints2(){
    var email = $("#email").val();
    var match_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(match_email) && email.length < 65){
        document.getElementById('email_notification').innerHTML = " ";
        $("#email").css('background-color', "white");
    }else{
        document.getElementById('email_notification').innerHTML = "Email is invalid";
        $("#email").css('background-color', "red");
    }
}
function constraints3(){
    var canada_phone = $("#phone").val();
    var match_phone = /^\d{3}-\d{3}-\d{4}$/;
    if(canada_phone.match(match_phone)){
        document.getElementById('phone_notification').innerHTML = " ";
        $("#phone").css('background-color', "white");
    }else{
        document.getElementById('phone_notification').innerHTML = "Phone is invalid";
        $("#phone").css('background-color', "red");
    }
}
function constraints4(){
    var password_con = $("#password1").val();
    var pass = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$/;
    if (password_con.match(pass) && password_con.length > 7){
        document.getElementById('password1_notification').innerHTML = " ";
        $("#password1").css('background-color', "white");
    }
    else{
        document.getElementById('password1_notification').innerHTML = "Password is invalid";
        $("#password1").css('background-color', "red");
    }
    var password2 = $("#password2").val();
    if (password2 === password_con){
        document.getElementById('password2_notification').innerHTML = " ";
        $("#password2").css('background-color', "white");
    }else{
        document.getElementById('password2_notification').innerHTML = "Passwords don't match";
        $("#password2").css('background-color', "red");
    }
}

function notice(){
    constraints1();
    constraints2();
    constraints3();
    constraints4();
    if (document.getElementById('username_notification').innerHTML == 'Username is invalid' ||
    document.getElementById('email_notification').innerHTML == "Email is invalid" ||
    document.getElementById('phone_notification').innerHTML == "Phone is invalid" || 
    document.getElementById('password1_notification').innerHTML == "Password is invalid" || 
    document.getElementById('password2_notification').innerHTML == "Passwords don't match"){
        $('#notification').html("At least one field is invalid. Please correct it before proceeding");
    }else{
        $('#notification').html(" ")
        $.ajax({
            url: "http://www.hanxianxuhuang.ca/a2/register",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                email: $("#email").val(),
                phone: $("#phone").val(),
                username: $("#username").val(),
                password2: $("#password2").val(),
                password1: $("#password1").val()
            }),
            statusCode:{
                200: function(){
                    $('#notification').html("User added")
                },
                404: function(){
                    $('#notification').html("Unknown error occurred")
                },
                409: function(){
                    $('#notification').html("Username has already been taken")
                }
            }
        })
    }
}

$().ready(function(){
    document.getElementById("username").oninput = constraints1;
    document.getElementById("phone").oninput = constraints3;
    document.getElementById("password1").oninput = constraints4;
    document.getElementById("password2").oninput = constraints4;
    document.getElementById("email").oninput = constraints2;
    document.getElementById("register").onclick = notice;
    var amazon_table = document.getElementById("cart-items");
    $("#add_update_item").click(function(){
        var input_item = new Item($("#name").val(), $("#price").val(), $("#quantity").val());
        input_item.price = input_item.price;
        input_item.quantity = input_item.quantity;
        input_item.total= Number(input_item.total).toFixed(2);
        var acc = 0;
        for (i = 0; i < $("#cart-items tr").length; i += 1){
            
            if (amazon_table.rows[i].cells[0].innerHTML != input_item.name){
                acc += 1;
            }
            else{
                amazon_table.rows[i].cells[1].innerHTML = input_item.price;
                amazon_table.rows[i].cells[2].innerHTML = input_item.quantity;
                amazon_table.rows[i].cells[3].innerHTML = input_item.total;
            }
        }
        if (acc === $("#cart-items tr").length && (input_item.name != "" && input_item.price != "" && input_item.quantity != "")){
            var row = amazon_table.insertRow(-1);
            var name_input = row.insertCell(0);
            var price_input = row.insertCell(1);
            var quantity_input = row.insertCell(2);
            var total_input = row.insertCell(3);
            var decrease_input = row.insertCell(4);
            var increase_input = row.insertCell(5);
            var delete_input = row.insertCell(6);
            name_input.innerHTML = input_item.name;
            price_input.innerHTML = input_item.price;
            quantity_input.innerHTML = input_item.quantity;
            total_input.innerHTML = input_item.total;
            decrease_input.innerHTML = `<button class="decrease" data-name="${input_item.name}" > - </button>`;
            increase_input.innerHTML = `<button class="increase" data-name="${input_item.name}"> + </button>`;
            delete_input.innerHTML = '<button class="delete"> delete </button>';
            name_id = input_item.name.split(" ").join("_");
            row.id = name_id;
        }
        document.getElementById("subtotal").innerHTML = get_subtotal();
        document.getElementById("taxes").innerHTML = get_taxes();
        document.getElementById("grand_total").innerHTML = get_grand_total();

    });
    
    function decrease_items(name){
        for (let i = 0; i < $("#cart-items tr").length; i += 1){
            if (amazon_table.rows[i].cells[0].innerHTML == name && amazon_table.rows[i].cells[2].innerHTML > 0){
                amazon_table.rows[i].cells[2].innerHTML --;
                amazon_table.rows[i].cells[2].innerHTML = Number(amazon_table.rows[i].cells[2].innerHTML);
                amazon_table.rows[i].cells[3].innerHTML = amazon_table.rows[i].cells[2].innerHTML * Number(amazon_table.rows[i].cells[1].innerHTML);
                amazon_table.rows[i].cells[3].innerHTML = Number(amazon_table.rows[i].cells[3].innerHTML).toFixed(2);
                document.getElementById("subtotal").innerHTML = get_subtotal();
                document.getElementById("taxes").innerHTML = get_taxes();
                document.getElementById("grand_total").innerHTML = get_grand_total();
            }
        }
    }
    function increase_items(name){
        for (let i = 0; i < $("#cart-items tr").length; i += 1){
            if (amazon_table.rows[i].cells[0].innerHTML == name){
                amazon_table.rows[i].cells[2].innerHTML ++;
                amazon_table.rows[i].cells[2].innerHTML = Number(amazon_table.rows[i].cells[2].innerHTML);
                amazon_table.rows[i].cells[3].innerHTML = amazon_table.rows[i].cells[2].innerHTML * Number(amazon_table.rows[i].cells[1].innerHTML);
                amazon_table.rows[i].cells[3].innerHTML = Number(amazon_table.rows[i].cells[3].innerHTML).toFixed(2);
                document.getElementById("subtotal").innerHTML = get_subtotal();
                document.getElementById("taxes").innerHTML = get_taxes();
                document.getElementById("grand_total").innerHTML = get_grand_total();
            }
        }
    }
    $("#cart-items").on("click", ".delete", function(){
        $(this).closest('tr').remove();
        document.getElementById("subtotal").innerHTML = get_subtotal();
        document.getElementById("taxes").innerHTML = get_taxes();
        document.getElementById("grand_total").innerHTML = get_grand_total();
    })

    $("#cart-items").on("click", ".decrease", function(){
        var curr_name = $(this).attr("data-name");
        console.log(curr_name);
        console.log(curr_name);
        decrease_items(curr_name);
        document.getElementById("subtotal").innerHTML = get_subtotal();
        document.getElementById("taxes").innerHTML = get_taxes();
        document.getElementById("grand_total").innerHTML = get_grand_total();
    })
    $("#cart-items").on("click", ".increase", function(){
        var curr_name = $(this).attr("data-name");
        increase_items(curr_name);
        document.getElementById("subtotal").innerHTML = get_subtotal();
        document.getElementById("taxes").innerHTML = get_taxes();
        document.getElementById("grand_total").innerHTML = get_grand_total();
    })

    function get_subtotal(){
        let subtotal = 0;
        for (let i = 1; i < $("#cart-items tr").length; i += 1){
            subtotal += Number(amazon_table.rows[i].cells[3].innerHTML);
        }
        return Number(subtotal).toFixed(2);
    }
    
    
    function get_taxes(){
        let tax = 0;
        for (let i = 1; i < $("#cart-items tr").length; i += 1){
            tax += Number(amazon_table.rows[i].cells[3].innerHTML) * 0.13;
        }
        return Number(tax).toFixed(2);
    }
    
    
    function get_grand_total(){
        let grand_total = 0;
        for (let i = 1; i < $("#cart-items tr").length; i += 1){
            grand_total += Number(amazon_table.rows[i].cells[3].innerHTML) * 1.13;
        }
        return Number(grand_total).toFixed(2);
    }

    let number = 1;
    $(window).scroll(function(){
        if ($(window).scrollTop() >= $(document).height() - $(window).height()){
            let URL = `http://www.hanxianxuhuang.ca/a2/text/data?paragraph=${number}`;
            number += 5;
            $.ajax({
                url: URL,
                method: "GET",
                dataType: "json"
            }).then(function(res){
                for (let i = 0; i < res.data.length; i+=1){
                    $("#data").append('<div id="paragraph_' + res.data[i].paragraph + '"><p>'
                    + res.data[i].content + '<b>(Paragraph: ' + res.data[i].paragraph + ')</b></p>'
                    + '<button class="like">Likes: ' + res.data[i].likes + '</button></div>');
                    if (res.next === false && i === res.data.length - 1){
                        $("#data").append(`<p><b>You have reached the end</b></p></div>`);
                    }
                }
            });
        }
        
    });
    $("#data").on("click", ".like", function(){
        var para = $(this).parent().attr("id");
        var num_para = Number(para.match(/\d+/g));
        let get_num = Number($(this).text().match(/\d+/g)) + 1;
        $(this).html(`Likes: ${get_num}`);
        let URL2 = `http://www.hanxianxuhuang.ca/a2/text/likes`;
        $.ajax({
            url: URL2,
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                paragraph: num_para
            }),
            success: function(){
                let get_num = Number($(this).text().match(/\d+/g)) + 1;
                $(this).html(`Likes: ${get_num}`);
            }
        })   
    })
});