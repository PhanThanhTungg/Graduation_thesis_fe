function fakeAsync(value: string, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, delay);
  });
}

export default async function CoursesPage() {
  await fakeAsync('CoursesPage');

  return <div>CoursesPage</div>
}