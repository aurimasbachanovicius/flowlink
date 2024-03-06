export type Left<L> = {
  tag: "Left";
  value: L;
};

export type Right<R> = {
  tag: "Right";
  value: R;
};

export type Either<L, R> = Left<L> | Right<R>;

function left<L>(value: L): Left<L> {
  return { tag: "Left", value };
}

function right<R>(value: R): Right<R> {
  return { tag: "Right", value };
}

function map<L, R, R2>(either: Either<L, R>, fn: (r: R) => R2): Either<L, R2> {
  if (either.tag === "Right") {
    return right(fn(either.value));
  } else {
    return either;
  }
}

function flatMap<L, R, R2>(
  either: Either<L, R>,
  fn: (r: R) => Either<L, R2>,
): Either<L, R2> {
  if (either.tag === "Right") {
    return fn(either.value);
  } else {
    return either;
  }
}

export { left, right, map, flatMap };
