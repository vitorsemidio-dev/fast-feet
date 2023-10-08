import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'

describe('Administrator', () => {
  it('should be able to create new administrator', () => {
    const administrator = Administrator.create({
      cpf: '12345678910',
      name: 'Administrator',
      password: '123456',
    })
    expect(administrator).toBeDefined()
  })

  it('should be able to generate id when create new administrator', () => {
    const administrator = Administrator.create({
      cpf: '12345678910',
      name: 'Administrator',
      password: '123456',
    })
    expect(administrator.id).toBeDefined()
    expect(administrator.id.toString()).toBeDefined()
  })

  it('should be able to provide id when create new administrator', () => {
    const administrator = Administrator.create(
      {
        cpf: '12345678910',
        name: 'Administrator',
        password: '123456',
      },
      new UniqueEntityId('administrator-id'),
    )
    expect(administrator.id.toString()).toEqual('administrator-id')
  })

  it('should be able to call toJson method', () => {
    const administrator = Administrator.create(
      {
        cpf: '12345678910',
        name: 'Administrator',
        password: '123456',
      },
      new UniqueEntityId('administrator-id'),
    )
    const expected = expect.objectContaining({
      id: 'administrator-id',
      cpf: '12345678910',
      name: 'Administrator',
      password: '123456',
      role: 'ADMINISTRATOR',
    })
    expect(administrator.toJson()).toEqual(expected)
  })

  it('should automatically assign the "administrator" role when creating a new administrator user', () => {
    const administrator = Administrator.create({
      cpf: '12345678910',
      name: 'Administrator',
      password: '123456',
    })
    expect(administrator.role).toEqual(Roles.ADMINISTRATOR)
  })
})
