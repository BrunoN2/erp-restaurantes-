import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Building,
  HeartHandshake,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee, TimeClockRecord, PayrollRecord } from '../../types';

export const HRModule: React.FC = () => {
  const {
    employees,
    timeClock,
    payroll,
    addEmployee,
    registerTimeClock,
    markPayrollPaid,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'COLABORADORES' | 'FOLHA' | 'PONTO' | 'BENEFICIOS'>('COLABORADORES');
  const [isNewEmpModalOpen, setIsNewEmpModalOpen] = useState(false);

  // New Employee Form State
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('COZINHA');
  const [baseSalary, setBaseSalary] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Total payroll cost
  const totalPayrollCost = payroll.reduce((sum, p) => sum + p.totalCostCompany, 0);
  const totalNetSalary = payroll.reduce((sum, p) => sum + p.netSalary, 0);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const sal = parseFloat(baseSalary);
    if (!name || isNaN(sal) || sal <= 0) {
      showToast('Preencha os dados obrigatórios do colaborador.', 'warning');
      return;
    }

    addEmployee({
      name,
      cpf: cpf || '000.000.000-00',
      role: role || 'Operador',
      department,
      admissionDate: new Date().toISOString().slice(0, 10),
      baseSalary: sal,
      benefits: {
        mealVoucher: 850.00,
        transportVoucher: 320.00,
        healthInsurance: 450.00
      },
      status: 'ATIVO',
      contact: {
        email: email || 'colaborador@mise.com.br',
        phone: phone || '(11) 90000-0000'
      }
    });

    setIsNewEmpModalOpen(false);
    setName('');
    setCpf('');
    setRole('');
    setBaseSalary('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setActiveSubTab('COLABORADORES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'COLABORADORES'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Quadro de Colaboradores ({employees.length})
          </button>
          <button
            onClick={() => setActiveSubTab('FOLHA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'FOLHA'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Folha de Pagamento & Encargos (DP)
          </button>
          <button
            onClick={() => setActiveSubTab('PONTO')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'PONTO'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Controle de Ponto Digital ({timeClock.length})
          </button>
          <button
            onClick={() => setActiveSubTab('BENEFICIOS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'BENEFICIOS'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Gestão de Benefícios (VR / VT / Saúde)
          </button>
        </div>

        <button
          onClick={() => setIsNewEmpModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Admitir Colaborador</span>
        </button>
      </div>

      {/* VIEW 1: Colaboradores */}
      {activeSubTab === 'COLABORADORES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {emp.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {emp.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900">{emp.name}</h4>
                <p className="text-xs text-amber-800 font-bold">{emp.role}</p>
                <p className="text-[10px] font-mono text-slate-400">CPF: {emp.cpf}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{emp.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.contact.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Admissão: {emp.admissionDate}</span>
                <span className="font-mono font-bold text-slate-900">
                  Salário Base: R$ {emp.baseSalary.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Folha de Pagamento & Encargos */}
      {activeSubTab === 'FOLHA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                Salários Líquidos a Pagar
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                R$ {totalNetSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-xs text-slate-400 mt-1 block font-medium">
                Valor depositado na conta dos funcionários
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold uppercase text-amber-800 block mb-1">
                Custo Total da Folha (Empresa)
              </span>
              <div className="text-2xl font-black text-amber-700 font-mono">
                R$ {totalPayrollCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-xs text-slate-500 mt-1 block font-medium">
                Inclui FGTS (8%), provisão de férias e 13º salário
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                Período de Competência
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                10/2026 (Mensal)
              </div>
              <span className="text-xs text-emerald-700 mt-1 block font-semibold">
                Cálculos de retenção INSS/IRRF automáticos
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Colaborador</th>
                    <th className="py-3.5 px-4 text-right">Salário Bruto</th>
                    <th className="py-3.5 px-4 text-right">INSS Retido</th>
                    <th className="py-3.5 px-4 text-right">IRRF Retido</th>
                    <th className="py-3.5 px-4 text-right">Benefícios</th>
                    <th className="py-3.5 px-4 text-right">Salário Líquido</th>
                    <th className="py-3.5 px-4 text-right">Custo Empresa</th>
                    <th className="py-3.5 px-4 text-center">Status / Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payroll.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{pay.employeeName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Ref: {pay.periodMonthYear}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                        R$ {pay.baseSalary.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-rose-700 font-semibold">
                        - R$ {pay.inssDeduction.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-rose-700 font-semibold">
                        - R$ {pay.irrfDeduction.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-rose-700 font-semibold">
                        - R$ {pay.benefitsDeduction.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                        R$ {pay.netSalary.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-700 font-bold">
                        R$ {pay.totalCostCompany.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {pay.status === 'PREVIA' ? (
                          <button
                            onClick={() => markPayrollPaid(pay.id)}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs transition-all flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Pagar</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1 mx-auto w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PAGO
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Controle de Ponto Digital */}
      {activeSubTab === 'PONTO' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Espelho de Ponto Eletrônico (Portaria 671 MTE)
              </h3>
              <p className="text-xs text-slate-500">
                Registro de jornadas, intervalos de alimentação e horas extras da equipe
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const emp = employees[0];
                  if (emp) registerTimeClock(emp.id, 'ENTRY');
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Bater Ponto (Entrada)</span>
              </button>
              <button
                onClick={() => {
                  const emp = employees[0];
                  if (emp) registerTimeClock(emp.id, 'EXIT');
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs cursor-pointer"
              >
                <span>Bater Ponto (Saída)</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Colaborador</th>
                  <th className="py-3.5 px-4 text-center">Entrada</th>
                  <th className="py-3.5 px-4 text-center">Início Almoço</th>
                  <th className="py-3.5 px-4 text-center">Fim Almoço</th>
                  <th className="py-3.5 px-4 text-center">Saída</th>
                  <th className="py-3.5 px-4 text-center">Horas Extras</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeClock.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{tc.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{tc.employeeName}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                      {tc.entryTime}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                      {tc.lunchStart}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">{tc.lunchEnd}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-700">{tc.exitTime}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-amber-700 font-bold">
                      {tc.overtimeMinutes > 0 ? `+${tc.overtimeMinutes} min` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          tc.status === 'HORA_EXTRA'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {tc.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: Gestão de Benefícios */}
      {activeSubTab === 'BENEFICIOS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase text-amber-800 block">
              Vale Refeição / Alimentação (VR/VA)
            </span>
            <div className="text-2xl font-mono font-black text-slate-900">R$ 850,00 /mês</div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Disponibilizado via cartão Alelo / Ticket para toda a equipe de cozinha e salão.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase text-blue-800 block">
              Vale Transporte (VT)
            </span>
            <div className="text-2xl font-mono font-black text-slate-900">R$ 320,00 /mês</div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Recarga automática do Bilhete Único / EMTU para deslocamento residência-trabalho.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase text-emerald-800 block">
              Plano de Saúde & Odontológico
            </span>
            <div className="text-2xl font-mono font-black text-slate-900">Coparticipação 20%</div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Convênio médico Bradesco Saúde com cobertura ambulatorial e hospitalar.
            </p>
          </div>
        </div>
      )}

      {/* Modal: Admitir Colaborador */}
      {isNewEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-4 text-slate-900">
            <h3 className="text-base font-extrabold text-slate-900">Admitir Novo Colaborador</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departamento</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="COZINHA">Cozinha</option>
                    <option value="ATENDIMENTO">Atendimento / Salão</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                    <option value="FINANCEIRO">Financeiro</option>
                    <option value="LOGISTICA">Logística / Estoque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    placeholder="Ex: Cozinheiro Júnior"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salário Base (R$)</label>
                  <input
                    type="number"
                    step="50"
                    min="1412"
                    required
                    placeholder="3000.00"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="colaborador@mise.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 98888-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewEmpModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Registrar Admissão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
