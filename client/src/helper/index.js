export const formatDate = (datetime) => {

	const date = new Date(datetime);
	 
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
};