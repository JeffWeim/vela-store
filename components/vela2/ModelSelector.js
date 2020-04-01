import { Formik } from 'formik'
import { useEffect } from 'react'
import ControlField from '../form/ControlField'

const initialValues = {
  frame: 'Baixo',
  color: 'Verde',
  tire: 'Creme',
  size: 'P'
}

const ModelSelector = ({ onModelChange, model }) => {
  const validate = values => {
    onModelChange(values)

    return {}
  }

  useEffect(() => onModelChange(initialValues), [])

  return (
    <div>
      <Formik initialValues={initialValues} validate={validate}>
        <form>
          <ControlField options={['Baixo', 'Reto']} name='frame' label='Quadro:' />
          <ControlField options={['Verde', 'Azul', 'Preto', 'Vermelho', 'Coral']} name='color' label='Cor:' />
          <ControlField options={['Creme', 'Preto']} name='tire' label='Pneu:' />
          <ControlField options={model.frame === 'Baixo' ? ['P', 'M'] : ['P', 'M', 'G']} name='size' label='Tamanho:' />
        </form>
      </Formik>
      <style jsx>{`
        div {
          padding: 1em;
        }
      `}</style>
    </div>
  )
}

export default ModelSelector
