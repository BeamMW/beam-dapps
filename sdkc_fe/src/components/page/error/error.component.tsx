type errorProps = {
  code: number;
  status: string;
  message: string;
};

const Err = ({ code, status, message }: errorProps) => (
  <h1>
    <span>
      code:
      {code}
    </span>
    <span>
      status:
      {status}
    </span>
    <span>
      message:
      {message}
    </span>
  </h1>
);

export default Err;
