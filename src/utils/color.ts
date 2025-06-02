
export function color(index: number) {
  let color;
  if (index % 2 === 0) {
    color = "pink";
  } else if (index % 3 === 0) {
    color = "green";
  } else if (index % 5 === 0) {
    color = "yellow";
  } else if (index % 7 === 0) {
    color = "red";
  } else if (index % 9 === 0) {
    color = "purple";
  } else {
    color = "black";
  }

  return color;
}