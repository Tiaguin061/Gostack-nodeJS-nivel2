import { startOfHour} from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/excessões
 * [x] Acesso ao repositório
*/

interface RequestDTO {
  provider: string;
  date: Date;
}

// executando a criação de um Appointment
class CreateAppointmentService {
  public async execute({provider, date}: RequestDTO): Promise<Appointment> {
    // Regra de negócio
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

    if(findAppointmentInSameDate) {
      throw Error("This appointment is already booked.")
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;

  }
}

export default CreateAppointmentService;