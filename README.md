----- EGET API TILL MONGODB-DATBAS -------

Detta är ett API för en MongoDB-databas som lagrar textdokument, som kan användas av en 
textredigerare i frontend. 

För att använda API:t:

1. Fyll  i korrekt URL till din databas, och rätt namn på din collection, i
filen db/.db-config.json.

2. Installera alla nödvändiga moduler genom kommandot "npm install" i rotkatalogen.

3. Starta express-servern genom kommandot "npm start" i rotkatalogen. 

--- OM ROUTES ---

API:t använder sig av en Express-struktur med ett antal routes för att hantera olika förfrågningar till servern:

/create - POST-request med en body som inkluderar dokument-titel och innehåll skapar ett nytt dokument.
/docs - GET-request skickar tillbaka alla dokument.
/remove-all - GET-request tar bort alla dokument i databasen.
/save - POST-request med ett dokuments ID och ett nytt innehåll uppdaterar dokumentet i databasen.
