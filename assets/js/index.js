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
    $('#content').load('dashboard.html', function(){
        $('.country-name').text('Woldwide');
        $.getJSON('https://covid19.mathdro.id/api/countries/India', function(data){
            stats=data;
            var date = new Date(data['lastUpdate']);
            $('.confirmed-cases').text(thousands_separators(data['confirmed']['value']));
            $('.recoverd-cases').text(thousands_separators(data['recovered']['value']));
            $('.death-cases').text(thousands_separators(data['deaths']['value']));
            $('.last-update label').append(date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes());
            // $.getJSON('https://covid19.mathdro.id/api/daily/', function(data){
            //     $('.daily-cases').text(thousands_separators(data[0]['totalConfirmed']));
            // });

                $.getJSON('https://covid19.mathdro.id/api/countries/India/confirmed', function(data){
                    var activeCases=0;
                    var province, confirmed, recovered, deaths, active;
                    province=confirmed=recovered=deaths=active=null;
                    $.each(data, function(){
                        console.log(data);
                        $.each(this, function(key, value){
                        if(key=='provinceState')
                            province=value;
                        else if(key=='confirmed')
                            confirmed=value;
                        else if(key=='recovered')
                            recovered=value;
                        else if(key=='deaths')
                            deaths=value;
                        else if(key=='active')
                        {
                            active=value;
                            activeCases+=active;
                        }
                        });
                        $('.table tbody').append(tableRow(province, confirmed, recovered, deaths, active));
                        $('.active-cases').text(thousands_separators(activeCases));
                    });
                    $('.loader').hide();
                });
        });
    });
});