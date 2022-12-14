/*
Get a list of the most visited cities.
Select the name of the city and the number of reservations for that city.
Order the results from highest number of reservations to lowest number of reservations.
*/

SELECT properties.city AS city, SUM(reservations)