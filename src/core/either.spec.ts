import { Either, left, right } from '@/core/either'

function doSomeThing(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = doSomeThing(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = doSomeThing(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})

test('success getRight()', () => {
  const result = doSomeThing(true)

  expect(result.getRight()).toBe(10)
  expect(result.getLeft()).toBe(undefined)
})

test('error getLeft()', () => {
  const result = doSomeThing(false)

  expect(result.getLeft()).toBe('error')
  expect(result.getRight()).toBe(undefined)
})
