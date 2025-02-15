import React, {
	useContext,
	useCallback,
	useState,
	useEffect,
	useRef,
} from "react"
//import {useNavigate} from "react-router-dom"
//import {pluralize, numberWithSpaces} from "../../../js/utils"
import UserContext from "../../../../contexts/user"
import useApi from "../../../../api/useApi"
import {getFirstAndLastName} from "../../../../js/utils"
import {useSnackbar} from "notistack"

//import format from "date-fns/format"
//import parse from "date-fns/parse"
//import eachDayOfInterval from "date-fns/eachDayOfInterval"
//import sub from "date-fns/sub"
//import {ru} from "date-fns/locale"

import SearchUser from "../../../../components/SearchUser"
import Tab from "../../../../components/Tab"
import Tabs from "../../../../components/Tabs"
import Autocomplete from "../../../../components/Autocomplete"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import Card from "../../../../components/Card"
import FileUploadField from "../../../../components/FileUploadField"
import Button from "../../../../components/Button"
import Coins from "../../../../components/Coins"
import Image from "../../../../components/Image"
import TextField from "../../../../components/TextField"
import Typography from "../../../../components/Typography"
import Staff from "../../../../components/Staff"
import RadioGroup from "../../../../components/RadioGroup"
//import CheckboxGroup from "../../../../components/CheckboxGroup"
import CheckboxLabel from "../../../../components/CheckboxLabel"

export default function Profile(props) {
	const {user} = useContext(UserContext)
	const {transferRubles} = useApi()
	const {enqueueSnackbar} = useSnackbar()

	//const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [tab, setTab] = useState("send")
	const [sum, setSum] = useState("")
	const [privateKey, setPrivateKey] = useState("")
	const [foundUser, setFoundUser] = useState({})
	const [cardNumber, setCardNumber] = useState("")
	const [via, setVia] = useState("email")
	const [saveCard, setSaveCard] = useState(false)

	const send = useCallback(async () => {
		const {status} = await transferRubles({
			private_key_from: privateKey,
			user_id_to: foundUser.id,
			amount: Number(sum),
		})
		if (status === "ok") {
			enqueueSnackbar({
				title: "Готово!",
				message: "Монеты переведены.",
				variant: "success",
			})
		} else {
			enqueueSnackbar({
				message:
					"Не удалось перевести монеты. Проверьте правильность введенных данных.",
				variant: "error",
			})
		}
	}, [privateKey, foundUser, sum, enqueueSnackbar])

	//const [file, setFile] = useState("")

	/*const {
		open: openChangePasswordDialog,
		close: closeChangePasswordDialog,
		props: changePasswordDialogProps,
		Component: ChangePasswordDialog,
	} = useDialog()*/

	/*const upload = useCallback(async () => {
		console.log(file)
		await uploadPhoto({file: file})
	}, [uploadPhoto, file])*/

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} sm={12} md={5} lg={3}>
				{/*<FileUploadField
					onChange={setFile}
					name={"name"}
					value={file}
				/>*/}
				<UserContext.Consumer>
					{({user}) => (
						<Card>
							<Typography variant={"h5"} gutterBottom>
								{user.name}
							</Typography>
							<Typography
								variant={"body2"}
								emphasis={"medium"}
								className={"mb-6"}
							>
								Мой баланс
							</Typography>

							<Coins amount={user.coins} />
						</Card>
					)}
				</UserContext.Consumer>
			</Grid>
			<Grid item xs={12} sm={12} md={7} lg={9}>
				<Card className={"mb-6"}>
					<Typography variant={"h5"} className={"mb-6"}>
						Переводы и обмен монет
					</Typography>
					<Tabs
						className={"mb-6"}
						value={tab}
						onChange={(_, value) => setTab(value)}
					>
						<Tab
							label={"Перевести другому человеку"}
							value={"send"}
						/>
						<Tab
							label={"Обмен монет на рубли"}
							value={"exchange"}
						/>
					</Tabs>
					{tab === "send" && (
						<RadioGroup
							className={"mb-4"}
							id={"via"}
							value={via}
							onChange={setVia}
							options={[
								{value: "email", label: "Перевод по email"},
								{value: "name", label: "Перевод по ФИО"},
							]}
							row
						/>
					)}
					{tab === "send" ? (
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={12} lg={4}>
								{via === "email" ? (
									<SearchUser
										key={"email"}
										onChange={setFoundUser}
										label={"Email получателя"}
										by={"email"}
									/>
								) : (
									<SearchUser
										key={"name"}
										onChange={setFoundUser}
										label={"ФИО получателя"}
										by={"name"}
									/>
								)}
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={4}>
								<TextField
									value={sum}
									onChange={e => setSum(e.target.value)}
									//icon={FiSearch}
									label={"Сумма"}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={4}>
								<TextField
									value={privateKey}
									onChange={e =>
										setPrivateKey(e.target.value)
									}
									//icon={FiSearch}
									label={"Ваш private-key"}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={4}>
								<Staff {...foundUser} card />
							</Grid>
						</Grid>
					) : (
						<Grid container spacing={3}>
							<Grid item xs={12} sm={12} md={12} lg={6}>
								<TextField
									value={cardNumber}
									onChange={e =>
										setCardNumber(e.target.value)
									}
									//icon={FiSearch}
									label={"Номер карты для вывода"}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} lg={6}>
								<TextField
									value={sum}
									onChange={e => setSum(e.target.value)}
									//icon={FiSearch}
									label={"Сумма"}
								/>
							</Grid>
						</Grid>
					)}

					{tab === "exchange" && (
						<CheckboxLabel
							label={"Запомнить карту"}
							checked={saveCard}
							onChange={setSaveCard}
							className={"mt-4"}
						/>
					)}

					<Button
						variant={"primary"}
						className={"mt-4"}
						onClick={send}
					>
						{tab === "send" ? "Отправить" : "Обменять и вывести"}
					</Button>
				</Card>
			</Grid>
		</Grid>
	)
}
