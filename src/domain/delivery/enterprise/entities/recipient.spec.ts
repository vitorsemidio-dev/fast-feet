import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'
import { Role } from '@prisma/client'
import { makeRecipient } from 'test/factories/recipient.factory'

const makeSutInput = (
  override: Partial<RecipientProps> = {},
  _id?: UniqueEntityId,
) => {
  const recipient = makeRecipient(override, _id)
  const props = {
    cpf: recipient.cpf,
    name: recipient.name,
    password: recipient.password,
    role: recipient.role,
  }
  const id = recipient.id
  return {
    props,
    id,
  }
}

describe('Recipient', () => {
  it('should be able to create new delivery driver', () => {
    const { props } = makeSutInput()
    const recipient = Recipient.create(props)
    expect(recipient).toBeDefined()
  })

  it('should be able to generate id when create new delivery driver', () => {
    const { props } = makeSutInput()
    const recipient = Recipient.create(props)
    expect(recipient.id).toBeDefined()
    expect(recipient.id.toString()).toBeDefined()
  })

  it('should be able to provide id when create new delivery driver', () => {
    const { props, id } = makeSutInput({}, new UniqueEntityId('recipient-id'))
    const recipient = Recipient.create(props, id)
    expect(recipient.id.toString()).toEqual('recipient-id')
  })

  it('should be able to call toJson method', () => {
    const { props } = makeSutInput()
    const recipient = Recipient.create(
      props,
      new UniqueEntityId('recipient-id'),
    )
    const expected = expect.objectContaining({
      id: 'recipient-id',
      cpf: props.cpf.value,
      name: props.name,
      password: props.password,
      role: Role.RECIPIENT,
    })
    expect(recipient.toJson()).toEqual(expected)
  })

  it('should automatically assign the "RECIPIENT" role when creating a new delivery driver user', () => {
    const { props } = makeSutInput()
    const recipient = Recipient.create(props)
    expect(recipient.role).toEqual(Roles.RECIPIENT)
  })
})
