/* eslint-disable canonical/id-match */

/* eslint-disable no-var */
import * as _TE from 'fp-ts/TaskEither'
import * as _E from 'fp-ts/lib/Either'
import * as _O from 'fp-ts/lib/Option'
import * as F from 'fp-ts/lib/function'

declare global {
  var E: typeof _E
  type Either<E, A> = _E.Either<E, A>

  var O: typeof _O
  type Option<A> = _O.Option<A>

  var TE: typeof _TE
  type TaskEither<E, A> = _TE.TaskEither<E, A>

  var pipe: typeof F.pipe
  var flow: typeof F.flow
  var flip: typeof F.flip
  var identity: typeof F.identity
}

globalThis.E = _E
globalThis.O = _O
globalThis.TE = _TE
globalThis.pipe = F.pipe
globalThis.flow = F.flow
globalThis.flip = F.flip
globalThis.identity = F.identity

export {}
