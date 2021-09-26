import { AddObserversType, BeamApiHandlers, CallApiType } from 'beamApiProps';

export class Beam {
  static addObservers: AddObserversType;

  static callApi: CallApiType;

  static setApiHandlers = (obj: BeamApiHandlers): void => {
    Beam.addObservers = obj.addObservers;
    Beam.callApi = obj.callApi;
  };
}
