function tableRow(province, confirmed, recovered, deaths, active)
{
return '<tr><td>'+province+'</td><td class="text-danger">'+confirmed+'</td><td class="text-success">'+recovered+'</td><td class="text-muted">'+deaths+'</td><td class="text-warning">'+active+'</td></tr>';
}

function thousands_separators(num)
{
var num_parts = num.toString().split(".");
num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
return num_parts.join(".");
}

$(document).ready(function(){
    $('#content').load('worldwide_dashboard.html', function(){
        $('.country-name').text('Woldwide');
        $.getJSON('https://covid19.mathdro.id/api/', function(data){
            stats=data;
            var date = new Date(data['lastUpdate']);
            $('.confirmed-cases').text(thousands_separators(data['confirmed']['value']));
            $('.recoverd-cases').text(thousands_separators(data['recovered']['value']));
            $('.death-cases').text(thousands_separators(data['deaths']['value']));
            $('.last-update label').append(date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes());
            // $.getJSON('https://covid19.mathdro.id/api/daily/', function(data){
            //     $('.daily-cases').text(thousands_separators(data[0]['totalConfirmed']));
            // });

            $.getJSON('https://covid19.mathdro.id/api/countries/', function(data){
                // var province='N/A';
                var activeCases=0;
                $.each(data['countries'], function(){
                    
                    var province=this['name'];
                    $.getJSON('https://covid19.mathdro.id/api/countries/'+this['iso2']+'/confirmed', function(data){
                        var confirmed, recovered, deaths, active;
                        confirmed=recovered=deaths=active=0;
                        $.each(data, function(){
                            $.each(this, function(key, value){
                            if(key=='confirmed')
                                confirmed+=value;
                            else if(key=='recovered')
                                recovered+=value;
                            else if(key=='deaths')
                                deaths+=value;
                            else if(key=='active')
                            {
                                active+=value;
                            }
                            });  
                        });
                        activeCases+=active;
                        $('.table tbody').append(tableRow(province, confirmed, recovered, deaths, active));
                        $('.active-cases').text(thousands_separators(activeCases));
                    });
                });
                $('.loader').hide();
            });
        });
    });
});