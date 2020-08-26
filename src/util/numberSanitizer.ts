export default function numberSanitize(number: String) {
  number = number.trim();
  number = number.replace("(", "");
  number = number.replace(")", "");
  number = number.replace("-", "");
  number = number.replace(" ", "");

  return number;
}
