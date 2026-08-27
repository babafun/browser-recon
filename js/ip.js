export async function getIP(){
    const response = await fetch("https://api.ipify.org?format=json");

    if (!response.ok){
        throw new Error(`failed to grab IP using ipify-api! details: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
}