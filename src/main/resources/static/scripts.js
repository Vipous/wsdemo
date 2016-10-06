/**
 * Created by vipous on 06.10.16.
 */
var stompClient = null;

function connect() {
    var socket = new SockJS('/data');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/data', function(greeting){
            showNumber(JSON.parse(greeting.body).data);
        });
    });
}
function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}
function showNumber(number) {
    document.getElementById('number').innerHTML = number
}